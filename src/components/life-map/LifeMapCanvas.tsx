import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Filter, Layers, ShoppingBag, Eye, Search, List, Map as MapIcon } from 'lucide-react';
import { Receipt } from '../../types/receipt';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatShortDate } from '../../utils/dateUtils';

interface LifeMapCanvasProps {
  receipts: Receipt[];
  onSelectReceipt: (r: Receipt) => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

interface MapNode {
  receipt: Receipt;
  x: number;
  y: number;
  radius: number;
  color: string;
  clusterKey: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f59e0b',
  Transportation: '#38bdf8',
  subscription: '#a855f7',
  Household: '#10b981',
  Investment: '#6366f1',
  'Small Cap fund 2': '#6366f1',
  'Small cap fund 1': '#6366f1',
  'Equity Mutual Fund E': '#6366f1',
  'Equity Mutual Fund A': '#6366f1',
  Festivals: '#ec4899',
  Health: '#14b8a6',
  Family: '#f97316',
  Apparel: '#e11d48',
  Salary: '#22c55e',
  Gift: '#d946ef',
  Education: '#3b82f6',
  Beauty: '#f43f5e',
  Other: '#64748b',
};

function getCategoryColor(category: string): string {
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  const catLower = category.toLowerCase();
  if (catLower.includes('food')) return '#f59e0b';
  if (catLower.includes('trans')) return '#38bdf8';
  if (catLower.includes('fund') || catLower.includes('invest')) return '#6366f1';
  if (catLower.includes('health')) return '#14b8a6';
  if (catLower.includes('fest')) return '#ec4899';
  if (catLower.includes('salary')) return '#22c55e';
  return '#94a3b8';
}

export function LifeMapCanvas({
  receipts,
  onSelectReceipt,
  selectedCategory,
  onSelectCategory,
}: LifeMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport transforms (Pan & Zoom)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Hover state
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Local map search
  const [mapSearch, setMapSearch] = useState('');
  const [layoutMode, setLayoutMode] = useState<'clusters' | 'chronological' | 'value'>('clusters');
  const [isTableView, setIsTableView] = useState(false);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (mapSearch.trim()) {
        const q = mapSearch.toLowerCase();
        return (
          r.category.toLowerCase().includes(q) ||
          (r.subcategory && r.subcategory.toLowerCase().includes(q)) ||
          (r.note && r.note.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [receipts, selectedCategory, mapSearch]);

  // Compute 2D node layout
  const nodes: MapNode[] = useMemo(() => {
    if (receipts.length === 0) return [];

    // Distinct categories
    const categories = Array.from(new Set(receipts.map((r) => r.category)));
    const catCenterMap = new Map<string, { cx: number; cy: number }>();

    // Arrange cluster centers in a celestial ring
    const totalCats = categories.length;
    const ringRadius = 420;
    categories.forEach((cat, idx) => {
      const angle = (idx / totalCats) * Math.PI * 2;
      catCenterMap.set(cat, {
        cx: Math.cos(angle) * ringRadius,
        cy: Math.sin(angle) * ringRadius,
      });
    });

    const minTime = receipts[0]?.date.getTime() || 0;
    const maxTime = receipts[receipts.length - 1]?.date.getTime() || 1;
    const timeSpan = maxTime - minTime || 1;

    return receipts.map((r, i) => {
      // Node size scaled logarithmically by amount
      const radius = Math.max(3, Math.min(18, Math.log10(Math.max(10, r.amount)) * 3.8));
      const color = getCategoryColor(r.category);

      let x = 0;
      let y = 0;

      if (layoutMode === 'clusters') {
        const center = catCenterMap.get(r.category) || { cx: 0, cy: 0 };
        // Pseudo-random deterministic jitter around category cluster center
        const seed = i * 137.5;
        const dist = Math.min(180, (Math.sin(seed) * 0.5 + 0.5) * 160 + radius * 2);
        const theta = seed;
        x = center.cx + Math.cos(theta) * dist;
        y = center.cy + Math.sin(theta) * dist;
      } else if (layoutMode === 'chronological') {
        // Spiral galaxy timeline
        const progress = (r.date.getTime() - minTime) / timeSpan;
        const theta = progress * Math.PI * 12;
        const rDist = 60 + progress * 520;
        x = Math.cos(theta) * rDist;
        y = Math.sin(theta) * rDist;
      } else {
        // Value concentric rings
        const amtNorm = Math.min(1, Math.log10(Math.max(1, r.amount)) / 5);
        const theta = (i / receipts.length) * Math.PI * 2;
        const rDist = 80 + amtNorm * 500;
        x = Math.cos(theta) * rDist;
        y = Math.sin(theta) * rDist;
      }

      return {
        receipt: r,
        x,
        y,
        radius,
        color,
        clusterKey: r.category,
      };
    });
  }, [receipts, layoutMode]);

  // Handle Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crisp rendering
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear Canvas with subtle dark atmospheric gradient
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Center point + pan + zoom
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);

    // 1. Draw subtle background orbital rings
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    ctx.lineWidth = 1;
    for (const r of [150, 300, 450, 600]) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Draw Nodes
    const searchLower = mapSearch.trim().toLowerCase();

    for (const node of nodes) {
      const isCatSelected = !selectedCategory || node.clusterKey === selectedCategory;
      const isSearchMatch =
        !searchLower ||
        node.receipt.category.toLowerCase().includes(searchLower) ||
        node.receipt.subcategory.toLowerCase().includes(searchLower) ||
        node.receipt.note.toLowerCase().includes(searchLower);

      const isHovered = hoveredNode?.receipt.id === node.receipt.id;

      let alpha = 0.65;
      if (!isCatSelected || !isSearchMatch) {
        alpha = 0.08;
      } else if (isHovered) {
        alpha = 1.0;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? node.radius * 1.4 : node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = alpha;
      ctx.fill();

      // Outer glow for hovered or high-value node
      if (isHovered || (isCatSelected && node.receipt.amount > 5000)) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.globalAlpha = isHovered ? 0.9 : 0.4;
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [nodes, zoom, pan, selectedCategory, hoveredNode, mapSearch]);

  // Resize observer to keep canvas sized properly
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas || !container) return;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Hit testing for hover & click
  const findNodeAtPoint = useCallback(
    (clientX: number, clientY: number): MapNode | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      // Invert transform to find coordinate in canvas space
      const worldX = (clickX - rect.width / 2 - pan.x) / zoom;
      const worldY = (clickY - rect.height / 2 - pan.y) / zoom;

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const dx = node.x - worldX;
        const dy = node.y - worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= node.radius + 6) {
          return node;
        }
      }
      return null;
    },
    [nodes, zoom, pan]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      const hit = findNodeAtPoint(e.clientX, e.clientY);
      setHoveredNode(hit);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const hit = findNodeAtPoint(e.clientX, e.clientY);
    if (hit) {
      onSelectReceipt(hit.receipt);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom((prev) => Math.max(0.3, Math.min(5, prev * zoomFactor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onSelectCategory(null);
    setMapSearch('');
  };

  // Top distinct categories for quick toggle pills
  const topCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of receipts) {
      counts.set(r.category, (counts.get(r.category) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [receipts]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[72vh] min-h-[520px] rounded-2xl bg-[#090d16] border border-slate-800 overflow-hidden select-none"
    >
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Category Pills & Search */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md max-w-2xl">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
              selectedCategory === null
                ? 'bg-cyan-500 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({receipts.length})
          </button>

          {topCategories.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(selectedCategory === cat ? null : cat)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-white font-semibold ring-1 ring-white/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getCategoryColor(cat) }}
              />
              <span>{cat}</span>
              <span className="text-[10px] font-mono text-slate-400">{count}</span>
            </button>
          ))}
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Table / Canvas Toggle for Accessibility */}
          <button
            onClick={() => setIsTableView(!isTableView)}
            aria-label={isTableView ? 'Switch to Interactive Canvas Life Map' : 'Switch to Accessible Data Table View'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-cyan-300 transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          >
            {isTableView ? <MapIcon className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            <span>{isTableView ? 'Canvas Map' : 'Accessible Table'}</span>
          </button>

          {/* Layout Mode Selector */}
          {!isTableView && (
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 backdrop-blur-md text-xs">
              <button
                onClick={() => setLayoutMode('clusters')}
                aria-pressed={layoutMode === 'clusters'}
                className={`px-2.5 py-1 rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  layoutMode === 'clusters' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clusters
              </button>
              <button
                onClick={() => setLayoutMode('chronological')}
                aria-pressed={layoutMode === 'chronological'}
                className={`px-2.5 py-1 rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  layoutMode === 'chronological' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setLayoutMode('value')}
                aria-pressed={layoutMode === 'value'}
                className={`px-2.5 py-1 rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  layoutMode === 'value' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Volume
              </button>
            </div>
          )}

          {/* Zoom controls */}
          {!isTableView && (
            <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 backdrop-blur-md gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(5, z * 1.25))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                aria-label="Reset viewport"
                title="Reset view"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Tabular View */}
      {isTableView ? (
        <div className="w-full h-full pt-20 px-6 pb-6 overflow-y-auto bg-[#080c14] text-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-editorial text-lg font-bold text-white">
                Accessible Transaction Matrix ({filteredReceipts.length} records)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Press Enter on any row to open full digital receipt
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th scope="col" className="p-3">Date</th>
                    <th scope="col" className="p-3">Category</th>
                    <th scope="col" className="p-3">Subcategory / Note</th>
                    <th scope="col" className="p-3">Payment Mode</th>
                    <th scope="col" className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredReceipts.slice(0, 100).map((r) => (
                    <tr
                      key={r.id}
                      tabIndex={0}
                      onClick={() => onSelectReceipt(r)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectReceipt(r);
                        }
                      }}
                      className="hover:bg-cyan-950/30 focus:bg-cyan-950/40 cursor-pointer transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                    >
                      <td className="p-3 font-mono text-slate-300">{formatShortDate(r.date)}</td>
                      <td className="p-3">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-medium"
                          style={{
                            backgroundColor: `${getCategoryColor(r.category)}20`,
                            color: getCategoryColor(r.category),
                          }}
                        >
                          {r.category}
                        </span>
                      </td>
                      <td className="p-3 text-white font-medium">{r.subcategory || r.note || '-'}</td>
                      <td className="p-3 text-slate-400 font-mono">{r.mode}</td>
                      <td className="p-3 text-right font-mono font-bold text-cyan-300">
                        {formatCurrency(r.amount, r.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReceipts.length > 100 && (
                <div className="p-3 text-center text-xs font-mono text-slate-500 bg-slate-950/80 border-t border-slate-800">
                  Displaying top 100 of {filteredReceipts.length} matching entries.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* The HTML5 Canvas Viewport */
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Interactive Life Map rendering ${receipts.length} personal transactions clustered by lifestyle categories.`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
          onWheel={handleWheel}
          className={`w-full h-full cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        />
      )}

      {/* Floating Node Hover Tooltip */}
      {hoveredNode && !isDragging && (
        <div
          className="pointer-events-none fixed z-30 p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-mono max-w-xs -translate-x-1/2 -translate-y-full -mt-3"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hoveredNode.color }}
            />
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
              {hoveredNode.receipt.category}
            </span>
          </div>

          <div className="text-slate-200 font-sans font-medium text-xs truncate">
            {hoveredNode.receipt.subcategory || hoveredNode.receipt.note || 'Receipt'}
          </div>

          <div className="flex items-center justify-between gap-4 mt-2 pt-1.5 border-t border-slate-800 text-[11px]">
            <span className="text-cyan-400 font-semibold">
              {formatCurrency(hoveredNode.receipt.amount, hoveredNode.receipt.currency)}
            </span>
            <span className="text-slate-400">
              {formatShortDate(hoveredNode.receipt.date)}
            </span>
          </div>

          <div className="text-[10px] text-cyan-300/80 mt-1 italic">
            Click node to view full digital receipt →
          </div>
        </div>
      )}

      {/* Map Bottom Legend & Hint */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-sm">
        <span>Drag to Pan</span>
        <span>•</span>
        <span>Scroll to Zoom</span>
        <span>•</span>
        <span>Click node to inspect</span>
      </div>
    </div>
  );
}
