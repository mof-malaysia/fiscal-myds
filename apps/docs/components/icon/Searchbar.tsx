"use client";
import {
  useContext,
  useRef,
  useState,
  useEffect,
  FunctionComponent,
} from "react";
import { Input, InputIcon } from "@mof-malaysia/myds-react/input";
import { Kbd } from "@mof-malaysia/myds-react/kbd";
import { SearchIcon } from "@mof-malaysia/myds-react/icon";
import { SearchContext } from "./SearchProvider";
import { getRosetta } from "@/locales/_server";
import { useParams } from "next/navigation";

function useFocusOnKeyPress<T extends HTMLElement>(
  key: string,
  isFocused: boolean,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused && e.key === key) {
        ref.current?.focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused, key]);

  return ref;
}

/** Filters the icon grid as you type: a search Input, with "/" to focus. */
const SearchBarIcon: FunctionComponent = () => {
  const params = useParams();
  const { t } = getRosetta(params.lang as "en" | "ms");
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("SearchBarIcons must be used within a SearchProvider");
  const { query, setQuery } = context;

  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useFocusOnKeyPress<HTMLInputElement>("/", hasFocus);

  return (
    <Input
      ref={inputRef}
      type="search"
      size="large"
      aria-label={t("searchbar.searchname")}
      placeholder={t("searchbar.searchname")}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") e.currentTarget.blur();
      }}
    >
      <InputIcon position="left">
        <SearchIcon aria-hidden />
      </InputIcon>
      {!hasFocus && !query && (
        <InputIcon
          position="right"
          className="text-txt-black-700 text-label-sm hidden w-auto items-center gap-1 whitespace-nowrap sm:flex"
        >
          <span aria-hidden>
            {t("searchbar.press")} <Kbd combo="/" /> {t("searchbar.tosearch")}
          </span>
        </InputIcon>
      )}
    </Input>
  );
};

SearchBarIcon.displayName = "SearchBarIcon";

export default SearchBarIcon;
