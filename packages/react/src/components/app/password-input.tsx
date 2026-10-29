"use client";

import React, { forwardRef, ReactNode, useState } from "react";
import { Input } from "../core/input";
import { EyeShowIcon } from "../../icons/eye-show";
import { EyeHideIcon } from "../../icons/eye-hide";
import { useControllableState } from "../../hooks";
import { clx } from "../../utils";

/**
 * PasswordInput masks what the user types, with a button to show it so they can
 * check it before submitting. It builds on Input, so it joins a surrounding
 * Field for label, hint and error.
 *
 * @example
 * <Field>
 *   <FieldLabel>Password</FieldLabel>
 *   <PasswordInput autoComplete="current-password" />
 * </Field>
 */

type InputProps = React.ComponentProps<typeof Input>;

interface PasswordInputProps
  extends Omit<InputProps, "type" | "append" | "children"> {
  /** Controlled visibility. */
  visible?: boolean;
  /** Initial visibility (uncontrolled). Defaults to hidden. */
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** Accessible name of the toggle while the password is hidden. */
  showLabel?: string;
  /** Accessible name of the toggle while the password is visible. */
  hideLabel?: string;
  /** Polite announcement after showing, e.g. "Your password is visible". Omit to stay silent. */
  shownAnnouncement?: ReactNode;
  /** Polite announcement after hiding, e.g. "Your password is hidden". Omit to stay silent. */
  hiddenAnnouncement?: ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      visible: visibleProp,
      defaultVisible = false,
      onVisibleChange,
      showLabel = "Show password",
      hideLabel = "Hide password",
      shownAnnouncement,
      hiddenAnnouncement,
      placeholder,
      autoComplete = "current-password",
      disabled,
      size = "small",
      className,
      ...props
    },
    ref,
  ) => {
    const [visible = false, setVisible] = useControllableState({
      prop: visibleProp,
      defaultProp: defaultVisible,
      onChange: onVisibleChange,
    });
    // Only announce after the user has toggled, never on first render
    const [touched, setTouched] = useState(false);

    const announcement = touched
      ? visible
        ? shownAnnouncement
        : hiddenAnnouncement
      : null;

    return (
      <div className={clx("relative w-full", className)}>
        <Input
          ref={ref}
          size={size}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          // Browsers must not autocorrect or capitalise a revealed password
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          {...props}
          // Leaves room for the toggle (Input pads for a right icon)
          data-has-right-icon
        >
          <button
            type="button"
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            disabled={disabled}
            onClick={() => {
              setTouched(true);
              setVisible(!visible);
            }}
            className={clx(
              // Trigger area matches the field height (password-input.mdx)
              "absolute inset-y-0 right-0 flex aspect-square h-full items-center justify-center rounded-r-md",
              "text-txt-black-700 hover:text-txt-black-900 cursor-pointer transition-colors duration-150 outline-none motion-reduce:transition-none",
              "focus-visible:outline-fr-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid",
              "disabled:text-txt-black-disabled disabled:cursor-not-allowed",
            )}
          >
            {visible ? (
              <EyeHideIcon aria-hidden className="size-5" />
            ) : (
              <EyeShowIcon aria-hidden className="size-5" />
            )}
          </button>
        </Input>
        {(shownAnnouncement || hiddenAnnouncement) && (
          <span className="sr-only" aria-live="polite">
            {announcement}
          </span>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
export type { PasswordInputProps };
