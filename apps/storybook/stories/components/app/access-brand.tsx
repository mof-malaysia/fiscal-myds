import React from "react";
import { Link } from "@mof-malaysia/ftds-react/link";
import { SERVICE_NAME } from "./gov-chrome";
import type {
  SignUpFormProps,
  SignUpValues,
} from "@mof-malaysia/ftds-react/sign-up-form";

/** The agency mark the access examples put above the panel. */
export const AccessBrand = ({ name = SERVICE_NAME }: { name?: string }) => (
  <a
    href="#home"
    className="text-txt-black-900 flex items-center gap-2 no-underline"
  >
    <span
      aria-hidden
      className="bg-bg-primary-600 text-txt-white grid size-9 place-content-center rounded-lg text-base font-semibold"
    >
      MF
    </span>
    <span className="flex flex-col leading-tight">
      <span className="text-body-md font-semibold">{name}</span>
      <span className="text-label-compact text-txt-black-700">
        Ministry of Finance Malaysia
      </span>
    </span>
  </a>
);

/** Footer row shared by the access examples: help and a language switch. */
export const AccessFooter = ({ children }: { children?: React.ReactNode }) => (
  <>
    {children}
    <span className="text-txt-black-700 flex flex-wrap justify-center gap-x-4 gap-y-1">
      <Link href="#help" primary underline="hover">
        Help
      </Link>
      <Link href="#bm" primary underline="hover" lang="ms">
        Bahasa Melayu
      </Link>
    </span>
  </>
);

/** Resolves after `ms`, to fake a network call. */
export const wait = (ms = 900) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** The checks the sign-up examples run before "creating" the account. */
export const validateSignUp = (values: SignUpValues) => {
  const errors: NonNullable<SignUpFormProps["errors"]> = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(values.email))
    errors.email = "Enter an email address like name@example.com";
  if (values.password.length < 8 || !/\d/.test(values.password))
    errors.password = "Choose a password that meets every rule";
  else if (values.password !== values.confirmPassword)
    errors.confirmPassword = "The two passwords don't match";
  if (!values.consent)
    errors.consent = "Agree to the terms of use and privacy notice to continue";
  return errors;
};
