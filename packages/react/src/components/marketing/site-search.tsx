"use client";

import {
  ComponentProps,
  FormEvent,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Button } from "../core/button";
import { Input, InputIcon } from "../core/input";
import { Kbd } from "../core/kbd";
import { SearchIcon } from "../../icons/search";
import { clx, isEditable } from "../../utils";

/**
 * SiteSearch is the "search this site" box for agency sites and service landing pages:
 * a labelled search field and one Search button inside a `<form role="search">`. By
 * default it submits a GET request (`?q=…`) to `action`, so it works without
 * JavaScript; pass `onSearch` to handle it in the page instead.
 *
 * It is built from Core parts only (Input, Button, Kbd), so it fits the navbar, a hero
 * or a results page. For suggestions while typing, compose `Autocomplete` (App tier); to
 * filter a list already on screen, use a search `Input`; for an app-wide "go to
 * anything", use the `Command` palette.
 *
 * @example
 * <SiteSearch action="/search" placeholder="For example, road tax" />
 *
 * @example
 * // Handled in the page, with "/" to focus
 * <SiteSearch shortcut onSearch={(query) => router.push(`/search?q=${query}`)} />
 */

interface SiteSearchLabels {
  /** The field's label (visually hidden unless `showLabel`). */
  label: string;
  /** The submit button. */
  submit: string;
}

const DEFAULT_LABELS: SiteSearchLabels = {
  label: "Search this site",
  submit: "Search",
};

interface SiteSearchProps
  extends Omit<ComponentProps<"form">, "onSubmit" | "children"> {
  /** Field and button size, relative to density. `large` suits a hero. @default "medium" */
  size?: "small" | "medium" | "large";
  /** Name of the query parameter. @default "q" */
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  /** Shows the label above the field instead of only to screen readers. */
  showLabel?: boolean;
  /** "/" focuses the field from anywhere on the page, with a key hint while it's empty. */
  shortcut?: boolean;
  /** Handles the search in the page; the form's own submit is prevented. */
  onSearch?: (query: string) => void;
  labels?: Partial<SiteSearchLabels>;
}

const SiteSearch = forwardRef<HTMLFormElement, SiteSearchProps>(
  (
    {
      size = "medium",
      name = "q",
      placeholder,
      defaultValue,
      showLabel = false,
      shortcut = false,
      onSearch,
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState(defaultValue ?? "");

    useEffect(() => {
      if (!shortcut) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (
          event.key !== "/" ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          isEditable(event.target)
        )
          return;
        event.preventDefault();
        inputRef.current?.focus();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [shortcut]);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      if (!onSearch) return;
      event.preventDefault();
      onSearch(query.trim());
    };

    return (
      <form
        ref={ref}
        role="search"
        onSubmit={onSubmit}
        className={clx("font-body flex w-full flex-col gap-2", className)}
        {...props}
      >
        <label
          htmlFor={id}
          className={clx(
            "text-txt-black-900 text-label-sm font-medium",
            !showLabel && "sr-only",
          )}
        >
          {labels.label}
        </label>
        <div className="flex w-full gap-2">
          <Input
            ref={inputRef}
            id={id}
            type="search"
            name={name}
            size={size}
            placeholder={placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !query) event.currentTarget.blur();
            }}
            className="min-w-0 flex-1"
          >
            <InputIcon position="left">
              <SearchIcon aria-hidden />
            </InputIcon>
            {shortcut && !query && (
              // Hidden while the field has focus: the key is only a hint for getting there
              <InputIcon
                position="right"
                className="max-sm:hidden [div:focus-within>&]:hidden"
              >
                <Kbd combo="/" aria-hidden />
              </InputIcon>
            )}
          </Input>
          <Button type="submit" size={size} className="shrink-0">
            {labels.submit}
          </Button>
        </div>
      </form>
    );
  },
);
SiteSearch.displayName = "SiteSearch";

export { SiteSearch };
export type { SiteSearchProps, SiteSearchLabels };
