import { useEffect, useState } from 'react';

export interface TerminalTheme {
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
  cursorBlink?: boolean; // optional for reduced-motion support
}

// Default fallback theme (WCAG AAA compliant)
const DEFAULT_THEME: TerminalTheme = {
  background: '#0F172A',
  foreground: '#F1F5F9',
  cursor: '#22C55E',
  selection: 'rgba(59, 130, 246, 0.3)',
  black: '#1E293B',
  red: '#EF4444',
  green: '#22C55E',
  yellow: '#F59E0B',
  blue: '#3B82F6',
  magenta: '#8B5CF6',
  cyan: '#06B6D4',
  white: '#F1F5F9',
  brightBlack: '#475569',
  brightRed: '#F87171',
  brightGreen: '#4ADE80',
  brightYellow: '#FBBF24',
  brightBlue: '#60A5FA',
  brightMagenta: '#A78BFA',
  brightCyan: '#22D3EE',
  brightWhite: '#FFFFFF',
};

export function useTerminalTheme(themeName: string = 'dyslexia-dark'): TerminalTheme {
  const [theme, setTheme] = useState<TerminalTheme>(DEFAULT_THEME);
  const [cursorBlink, setCursorBlink] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      // Helper to safely read CSS var or fallback
      const getVar = (name: string, fallback: string) => {
        const val = styles.getPropertyValue(name).trim();
        return val || fallback;
      };

      setTheme({
        background: getVar(`--tb-${themeName}-bg`, DEFAULT_THEME.background),
        foreground: getVar(`--tb-${themeName}-fg`, DEFAULT_THEME.foreground),
        cursor: getVar(`--tb-${themeName}-cursor`, DEFAULT_THEME.cursor),
        selection: getVar(`--tb-${themeName}-selection`, DEFAULT_THEME.selection),
        black: getVar(`--tb-${themeName}-black`, DEFAULT_THEME.black),
        red: getVar(`--tb-${themeName}-red`, DEFAULT_THEME.red),
        green: getVar(`--tb-${themeName}-green`, DEFAULT_THEME.green),
        yellow: getVar(`--tb-${themeName}-yellow`, DEFAULT_THEME.yellow),
        blue: getVar(`--tb-${themeName}-blue`, DEFAULT_THEME.blue),
        magenta: getVar(`--tb-${themeName}-magenta`, DEFAULT_THEME.magenta),
        cyan: getVar(`--tb-${themeName}-cyan`, DEFAULT_THEME.cyan),
        white: getVar(`--tb-${themeName}-white`, DEFAULT_THEME.white),
        brightBlack: getVar(`--tb-${themeName}-bright-black`, DEFAULT_THEME.brightBlack),
        brightRed: getVar(`--tb-${themeName}-bright-red`, DEFAULT_THEME.brightRed),
        brightGreen: getVar(`--tb-${themeName}-bright-green`, DEFAULT_THEME.brightGreen),
        brightYellow: getVar(`--tb-${themeName}-bright-yellow`, DEFAULT_THEME.brightYellow),
        brightBlue: getVar(`--tb-${themeName}-bright-blue`, DEFAULT_THEME.brightBlue),
        brightMagenta: getVar(`--tb-${themeName}-bright-magenta`, DEFAULT_THEME.brightMagenta),
        brightCyan: getVar(`--tb-${themeName}-bright-cyan`, DEFAULT_THEME.brightCyan),
        brightWhite: getVar(`--tb-${themeName}-bright-white`, DEFAULT_THEME.brightWhite),
        cursorBlink, // include in theme object
      });
    };

    // Initial sync
    updateTheme();

    // Listen for style changes (e.g., theme toggle)
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // Listen for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotion = (e: MediaQueryListEvent) => {
      setCursorBlink(!e.matches);
      updateTheme(); // re-apply theme with new cursorBlink
    };
    mediaQuery.addEventListener('change', handleReducedMotion);

    // Set initial cursor blink based on current preference
    setCursorBlink(!mediaQuery.matches);
    updateTheme(); // ensure initial render has correct cursorBlink

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleReducedMotion);
    };
  }, [themeName, cursorBlink]);

  return theme;
}