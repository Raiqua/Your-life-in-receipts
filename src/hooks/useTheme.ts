import { useState, useEffect } from 'react';

export interface ThemePreset {
  id: string;
  name: string;
  color: string;
  rgb: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'cyan', name: 'Cyan', color: '#22d3ee', rgb: '34, 211, 238' },
  { id: 'blue', name: 'Electric Blue', color: '#38bdf8', rgb: '56, 189, 248' },
  { id: 'violet', name: 'Violet', color: '#a855f7', rgb: '168, 85, 247' },
  { id: 'emerald', name: 'Emerald', color: '#34d399', rgb: '52, 211, 153' },
  { id: 'amber', name: 'Amber', color: '#fbbf24', rgb: '251, 191, 36' },
  { id: 'rose', name: 'Rose', color: '#fb7185', rgb: '251, 113, 133' },
];

function hexToRgb(hex: string): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return '56, 189, 248';
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

export function useTheme() {
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('yir_theme_id') || 'blue';
  });
  const [customColor, setCustomColor] = useState<string>(() => {
    return localStorage.getItem('yir_custom_color') || '#38bdf8';
  });

  const applyTheme = (color: string, rgbStr: string) => {
    const root = document.documentElement;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--accent-soft', `rgba(${rgbStr}, 0.15)`);
    root.style.setProperty('--accent-glow', `rgba(${rgbStr}, 0.35)`);
    root.style.setProperty('--accent-rgb', rgbStr);
  };

  useEffect(() => {
    if (activeThemeId === 'custom') {
      const rgb = hexToRgb(customColor);
      applyTheme(customColor, rgb);
      localStorage.setItem('yir_theme_id', 'custom');
      localStorage.setItem('yir_custom_color', customColor);
    } else {
      const preset = THEME_PRESETS.find((p) => p.id === activeThemeId) || THEME_PRESETS[1];
      applyTheme(preset.color, preset.rgb);
      localStorage.setItem('yir_theme_id', preset.id);
    }
  }, [activeThemeId, customColor]);

  const selectPreset = (id: string) => {
    setActiveThemeId(id);
  };

  const setCustomAccent = (hex: string) => {
    setCustomColor(hex);
    setActiveThemeId('custom');
  };

  return {
    activeThemeId,
    customColor,
    presets: THEME_PRESETS,
    selectPreset,
    setCustomAccent,
  };
}
