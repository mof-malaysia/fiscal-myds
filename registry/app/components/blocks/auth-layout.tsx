// registry:block — composed page section, installs to components/blocks
import React, { ComponentProps, ReactNode, forwardRef } from "react";
import { clx } from "@/lib/ftds/utils";

/**
 * AuthLayout is the frame of every sign-in, sign-up, password and verification
 * screen: a full-height page on the Well with one centred Paper panel. The panel
 * holds the page's only h1, a short description and the form; the brand sits
 * above it and the footer (a "Create an account" link, a language switch) below.
 *
 * The panel is at most 26rem wide, so the form reads as one short column on every
 * screen. On a phone it fills the width and the Well shows only above and below.
 *
 * @example
 * <AuthLayout
 *   brand={<AgencyMark />}
 *   title="Sign in to MyFiscal"
 *   description="Use MyDigital ID or your email and password."
 *   footer={<>New here? <Link href="/sign-up" primary>Create an account</Link></>}
 * >
 *   <SignInForm methods={["mydigital-id", "password"]} onSubmit={signIn} />
 * </AuthLayout>
 */

interface AuthLayoutProps extends Omit<ComponentProps<"main">, "title"> {
  /** Agency logo or name, above the panel. */
  brand?: ReactNode;
  /** The page title, rendered as the only h1. */
  title: ReactNode;
  /** One or two sentences under the title: what this screen is for. */
  description?: ReactNode;
  /** Under the panel: links to the other auth screens, a language switch, help. */
  footer?: ReactNode;
  /** Above the title inside the panel, e.g. a back link or an icon. */
  eyebrow?: ReactNode;
  /** Classes for the Paper panel. */
  panelClassName?: string;
}

const AuthLayout = forwardRef<HTMLElement, AuthLayoutProps>(
  (
    {
      brand,
      title,
      description,
      footer,
      eyebrow,
      panelClassName,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <main
      ref={ref}
      className={clx(
        "bg-bg-washed text-txt-black-900 font-body flex min-h-dvh w-full flex-col items-center px-4 py-10 sm:justify-center sm:py-16",
        className,
      )}
      {...props}
    >
      <div className="gap-stack-lg flex w-full max-w-[26rem] flex-col">
        {brand && (
          <div className="flex items-center justify-center">{brand}</div>
        )}
        <div
          className={clx(
            // Sheet on the Well: tone, not a shadow, lifts the panel (DESIGN.md, Elevation)
            "bg-bg-white gap-stack-lg flex flex-col rounded-lg p-6 sm:p-8",
            panelClassName,
          )}
        >
          <header className="flex flex-col gap-2">
            {eyebrow}
            <h1 className="text-heading-2xs text-txt-black-900 font-semibold text-balance">
              {title}
            </h1>
            {description && (
              <p className="text-content text-txt-black-700">{description}</p>
            )}
          </header>
          {children}
        </div>
        {footer && (
          <div className="text-content text-txt-black-700 flex flex-col items-center gap-2 text-center">
            {footer}
          </div>
        )}
      </div>
    </main>
  ),
);
AuthLayout.displayName = "AuthLayout";

export { AuthLayout };
export type { AuthLayoutProps };
