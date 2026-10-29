import {
  FunctionComponent,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { MoonIcon } from "@/components/ui/icons/moon";
import { SunIcon } from "@/components/ui/icons/sun";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/ftds/hooks/use-theme";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";

interface Theme {
  label: string;
  value: string;
  icon: ReactNode;
}

interface ThemeSwitch {
  as?: "toggle" | "select";
  themes?: Array<Theme>;
  onChange?: (value: string) => void;
  /**
   * Names the control, with the current theme after it: "Theme: Light".
   * @default "Theme"
   */
  label?: string;
}

/** Merges the icon classes onto the theme's icon element. */
const ThemeIcon: FunctionComponent<{ icon: ReactElement }> = ({ icon }) =>
  useRender({
    render: icon,
    props: mergeProps<"svg">(
      { className: "text-txt-black-900 size-4 flex-shrink-0" },
      {},
    ),
  });

const ThemeSwitch: FunctionComponent<ThemeSwitch> = ({
  as = "toggle",
  themes = [
    { label: "Light", value: "light", icon: <SunIcon /> },
    { label: "Dark", value: "dark", icon: <MoonIcon /> },
  ],
  onChange,
  label = "Theme",
}) => {
  const { theme, setTheme, defaultTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getTheme = (value: string) =>
    themes.find((theme) => theme.value === value);

  const displayIcon = (value?: string | null) => {
    if (!value) return null;
    const _theme = getTheme(value);
    if (isValidElement(_theme?.icon)) return <ThemeIcon icon={_theme.icon} />;
    return _theme?.icon;
  };

  /*------------------ as toggle -----------------*/
  const handleChange = (value?: string) => {
    if (themes.length <= 1) return;

    if (as === "toggle") {
      const nextIndex = (currentIndex + 1) % themes.length;
      setCurrentIndex(nextIndex);
      setTheme(themes[nextIndex]!.value);
      if (onChange) onChange(themes[nextIndex]!.value);
    } else if (as === "select") {
      if (!value) return;
      setTheme(value);
      if (onChange) onChange(value);
    }
  };

  useEffect(() => {
    if (as === "toggle") {
      const index = themes.findIndex((t) => t.value === theme);
      setCurrentIndex(index);
    }
    // Sync only when the active theme changes; `themes` defaults to a new array each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  if (as === "toggle")
    return (
      <Button
        variant="default-ghost"
        className="aspect-square flex-shrink-0 rounded-md"
        onClick={() => handleChange()}
        size="small"
        aria-label={`${label}: ${themes[currentIndex]?.label ?? ""}`}
        iconOnly
      >
        {displayIcon(themes[currentIndex]?.value) ||
          themes[currentIndex]?.label}
      </Button>
    );

  /*------------------ as select -----------------*/

  return (
    <Select
      size="small"
      variant="outline"
      value={theme || defaultTheme}
      onValueChange={handleChange}
    >
      <SelectTrigger
        className="w-fit"
        aria-label={`${label}: ${getTheme(theme || defaultTheme)?.label ?? ""}`}
      >
        <SelectValue>
          {(value) => (
            <div className="flex items-center gap-2">
              <div>{displayIcon(value as string)}</div>
              <span>{getTheme(value as string)?.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {themes.map((theme) => (
          <SelectItem
            key={theme.value}
            value={theme.value}
            aria-label={theme.label}
          >
            {theme.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

ThemeSwitch.displayName = "ThemeSwitch";

export { ThemeSwitch };
