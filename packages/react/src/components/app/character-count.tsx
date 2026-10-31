"use client";

import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { TextArea } from "../core/textarea";
import { WarningCircleIcon } from "../../icons/warning-circle";
import { useControllableState, useMergedRefs } from "../../hooks";
import { clx } from "../../utils";

/**
 * CharacterCount adds a live limit to a TextArea: "You have 12 characters
 * remaining". The message turns to a warning near the limit and to an error past
 * it. Users can keep typing over the limit (so pasted text isn't cut off), but
 * the field becomes invalid and the form won't submit until they shorten it.
 *
 * Place it inside a Field: the count joins the field's description, and the
 * over-limit state flows into the field's validity (show it with FieldError).
 *
 * @example
 * <Field>
 *   <FieldLabel>Tell us why you are appealing</FieldLabel>
 *   <CharacterCount limit={500} />
 *   <FieldError />
 * </Field>
 */

type CountBy = "characters" | "words";

interface CharacterCountMessageState {
  /** Characters or words used so far. */
  count: number;
  limit: number;
  /** Negative once over the limit. */
  remaining: number;
  countBy: CountBy;
}

type TextAreaProps = React.ComponentProps<typeof TextArea>;

interface CharacterCountProps extends Omit<
  TextAreaProps,
  "value" | "defaultValue" | "maxLength"
> {
  /** The most characters (or words) allowed. */
  limit: number;
  /** Count characters (default) or words. */
  countBy?: CountBy;
  /** Remaining count at or below which the message shows as a warning. Defaults to 10% of the limit. */
  warningThreshold?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Build the message yourself, e.g. for Bahasa Melayu. */
  formatMessage?: (state: CharacterCountMessageState) => ReactNode;
  /** Message given to the browser's validity, shown by FieldError when over the limit. */
  overLimitMessage?: (state: CharacterCountMessageState) => string;
  /** Wait this long (ms) after typing stops before screen readers hear the count. */
  announceDelay?: number;
  /** Class for the wrapper around the text area and message. */
  wrapperClassName?: string;
}

const countValue = (value: string, countBy: CountBy) => {
  if (countBy === "words")
    return value.trim().split(/\s+/).filter(Boolean).length;
  // Count code points, so an emoji is one character, not two
  let n = 0;
  for (const _ of value) n++;
  return n;
};

const unit = (n: number, countBy: CountBy) =>
  countBy === "words"
    ? n === 1
      ? "word"
      : "words"
    : n === 1
      ? "character"
      : "characters";

const defaultFormatMessage = ({
  remaining,
  countBy,
}: CharacterCountMessageState) =>
  remaining >= 0
    ? `You have ${remaining} ${unit(remaining, countBy)} remaining`
    : `You have ${-remaining} ${unit(-remaining, countBy)} too many`;

const defaultOverLimitMessage = ({
  limit,
  countBy,
}: CharacterCountMessageState) =>
  `Enter ${limit} ${unit(limit, countBy)} or fewer`;

const CharacterCount = forwardRef<HTMLTextAreaElement, CharacterCountProps>(
  (
    {
      limit,
      countBy = "characters",
      warningThreshold,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onChange,
      formatMessage = defaultFormatMessage,
      overLimitMessage = defaultOverLimitMessage,
      announceDelay = 1000,
      wrapperClassName,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const [value = "", setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    // onChange counts the new text for validity; render reuses that count
    const counted = useRef({ value: "", countBy, count: 0 });
    const countOf = (text: string) => {
      const c = counted.current;
      if (c.value !== text || c.countBy !== countBy) {
        counted.current = {
          value: text,
          countBy,
          count: countValue(text, countBy),
        };
      }
      return counted.current.count;
    };
    const stateFor = (count: number): CharacterCountMessageState => ({
      count,
      limit,
      remaining: limit - count,
      countBy,
    });

    const state = stateFor(countOf(value));
    const { remaining } = state;
    const threshold = warningThreshold ?? Math.ceil(limit * 0.1);
    const status: "default" | "warning" | "over" =
      remaining < 0 ? "over" : remaining <= threshold ? "warning" : "default";
    const message = formatMessage(state);

    // Over the limit is a validity error, so Field, Form and native submit all block it
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const setRefs = useMergedRefs(innerRef, forwardedRef);
    const validityMessage = status === "over" ? overLimitMessage(state) : "";
    useLayoutEffect(() => {
      innerRef.current?.setCustomValidity(validityMessage);
    }, [validityMessage]);

    // Screen readers hear the count once typing pauses, not on every key
    const [announced, setAnnounced] = useState<ReactNode>(null);
    const typed = useRef(false);
    useEffect(() => {
      if (!typed.current) return;
      const timer = setTimeout(() => setAnnounced(message), announceDelay);
      return () => clearTimeout(timer);
      // `message` is derived from value; re-run when the text changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, announceDelay]);

    return (
      <div className={clx("flex w-full flex-col gap-1.5", wrapperClassName)}>
        <TextArea
          ref={setRefs}
          value={value}
          onChange={(event) => {
            typed.current = true;
            const next = event.currentTarget.value;
            // Set validity now: Field re-validates before this component's effects run
            const nextState = stateFor(countOf(next));
            event.currentTarget.setCustomValidity(
              nextState.remaining < 0 ? overLimitMessage(nextState) : "",
            );
            setValue(next);
            onChange?.(event);
          }}
          data-over-limit={status === "over" ? "" : undefined}
          className={clx("data-[over-limit]:border-bg-danger-600", className)}
          {...props}
        />
        {/* Joins the field's aria-describedby, so the count is read on focus */}
        <FieldPrimitive.Description
          className={clx(
            "font-body text-content flex items-start gap-1.5",
            status === "default" && "text-txt-black-700",
            status === "warning" && "text-txt-warning font-medium",
            status === "over" && "text-txt-danger font-medium",
          )}
        >
          {status === "over" && (
            <WarningCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
          )}
          <span>{message}</span>
        </FieldPrimitive.Description>
        <span className="sr-only" aria-live="polite">
          {announced}
        </span>
      </div>
    );
  },
);
CharacterCount.displayName = "CharacterCount";

export { CharacterCount };
export type { CharacterCountProps, CharacterCountMessageState };
