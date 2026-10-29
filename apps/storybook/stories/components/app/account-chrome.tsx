import React, { ReactNode } from "react";
import { GovFooter, GovMasthead, SERVICE_NAME } from "./gov-chrome";
import { Avatar, AvatarFallback } from "@mof-malaysia/myds-react/avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@mof-malaysia/myds-react/menu";
import { Button } from "@mof-malaysia/myds-react/button";
import { BellIcon } from "@mof-malaysia/myds-react/icon";

/**
 * The citizen-facing frame the account examples share: the government
 * Masthead, a slim service header with the signed-in person, the page, and the
 * legal footer.
 */
export const AccountChrome = ({
  children,
  unread = 0,
  signedIn = true,
}: {
  children: ReactNode;
  unread?: number;
  signedIn?: boolean;
}) => (
  <div className="bg-bg-white text-txt-black-900 font-body flex min-h-dvh flex-col">
    <GovMasthead />

    <header className="border-otl-gray-200 border-b">
      <div className="px-surface mx-auto flex h-16 max-w-6xl items-center gap-3">
        <a
          href="#home"
          className="text-txt-black-900 flex items-center gap-2 font-semibold no-underline"
        >
          <span
            aria-hidden
            className="bg-bg-primary-600 text-txt-white grid size-8 place-content-center rounded-md text-sm"
          >
            M
          </span>
          {SERVICE_NAME}
        </a>
        <div className="ml-auto flex items-center gap-1">
          {signedIn && (
            <>
              <Button
                variant="default-ghost"
                iconOnly
                aria-label={
                  unread ? `Notifications, ${unread} unread` : "Notifications"
                }
                render={<a href="#notifications" />}
                className="relative"
              >
                <BellIcon aria-hidden className="size-5" />
                {unread > 0 && (
                  <span
                    aria-hidden
                    className="bg-bg-danger-600 absolute top-1.5 right-1.5 size-2 rounded-full"
                  />
                )}
              </Button>
              <Menu>
                <MenuTrigger
                  aria-label="Account menu for Nur Aisyah"
                  render={
                    <Button variant="default-ghost" className="gap-2 px-2" />
                  }
                >
                  <Avatar size="small">
                    <AvatarFallback>NA</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Nur Aisyah</span>
                </MenuTrigger>
                <MenuContent align="end">
                  <MenuItem>My applications</MenuItem>
                  <MenuItem>Account settings</MenuItem>
                  <MenuSeparator />
                  <MenuItem>Sign out</MenuItem>
                </MenuContent>
              </Menu>
            </>
          )}
        </div>
      </div>
    </header>

    <main id="main" className="px-surface mx-auto w-full max-w-6xl flex-1 py-8">
      {children}
    </main>

    <GovFooter />
  </div>
);
