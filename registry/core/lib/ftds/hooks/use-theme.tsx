import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  defaultTheme: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  defaultTheme: "light",
});

interface ThemeProviderProps {
  children: ReactNode;
  /** Used until a saved theme is read, and when none is saved. */
  defaultTheme?: string;
  /** localStorage key the chosen theme is saved under. */
  storageKey?: string;
  /**
   * Every theme class this provider may put on `<html>`. Switching removes all
   * of them before adding the new one, so a class set before the provider
   * mounted (by a script in `<head>`, say) never lingers.
   * @default ["light", "dark"]
   */
  themes?: string[];
}

/** localStorage can throw (private mode, blocked storage); treat that as nothing saved. */
function readStoredTheme(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function applyTheme(theme: string, themes: string[]) {
  const { classList } = document.documentElement;
  classList.remove(...themes);
  classList.add(theme);
}

/**
 * Holds the current theme and keeps the `<html>` class in step with it. On
 * mount it restores the theme saved under `storageKey` (or applies
 * `defaultTheme`); `setTheme` switches the class and saves the choice.
 *
 * The saved theme is read after hydration, so the first paint uses whatever
 * class the page already has. To avoid a flash of the wrong theme, also set
 * the class from `localStorage` in a blocking script in `<head>`.
 */
const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
  storageKey = "theme",
  themes = ["light", "dark"],
}) => {
  const [theme, setThemeState] = useState<string>(defaultTheme);

  useEffect(() => {
    const initial = readStoredTheme(storageKey) ?? defaultTheme;
    applyTheme(initial, themes);
    setThemeState(initial);
    // Restore once on mount; `themes` defaults to a new array each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const setTheme = (newTheme: string) => {
    applyTheme(newTheme, [...themes, theme]);
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch {
      // Not saved; the theme still applies for this visit
    }
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, defaultTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export { ThemeProvider, ThemeContext, useTheme };
