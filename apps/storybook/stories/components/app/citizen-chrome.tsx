import React, { ReactNode } from "react";
import { GovFooter, GovMasthead, SERVICE_NAME } from "./gov-chrome";
import { Skiplink } from "@mof-malaysia/ftds-react/skiplink";
import { Link } from "@mof-malaysia/ftds-react/link";

/** Shared frame for the citizen example pages: masthead, service header, footer. */

const JATA =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/500px-Coat_of_arms_of_Malaysia.svg.png";

export const CitizenChrome = ({
  children,
  signedIn = true,
  wide = false,
}: {
  children: ReactNode;
  signedIn?: boolean;
  /** Dashboard-width content instead of a single form column. */
  wide?: boolean;
}) => (
  <div className="bg-bg-white font-body text-txt-black-900 flex min-h-screen flex-col">
    <Skiplink href="#main-content">Skip to main content</Skiplink>
    <GovMasthead />

    <header className="border-otl-gray-200 bg-bg-white border-b">
      <div className="mx-auto flex h-16 max-w-screen-lg items-center gap-3 px-4 sm:px-6">
        <img src={JATA} alt="" width={32} className="select-none" />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-content font-semibold">{SERVICE_NAME}</span>
          <span className="text-txt-black-700 text-label-compact">
            Kementerian Kewangan Malaysia
          </span>
        </div>
        {signedIn && (
          <div className="text-content ml-auto flex items-center gap-4">
            <span className="text-txt-black-700 hidden sm:inline">
              Nur Aisyah binti Ahmad
            </span>
            <Link href="#" underline="hover" primary className="font-medium">
              Sign out
            </Link>
          </div>
        )}
      </div>
    </header>

    <main
      id="main-content"
      className={
        wide
          ? "mx-auto w-full max-w-screen-lg flex-1 px-4 py-8 sm:px-6 sm:py-12"
          : "mx-auto w-full max-w-screen-md flex-1 px-4 py-8 sm:px-6 sm:py-12"
      }
    >
      {children}
    </main>

    <GovFooter />
  </div>
);
