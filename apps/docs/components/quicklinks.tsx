"use client";

import { Link } from "@mof-malaysia/myds-react/link";
import { Button, ButtonIcon } from "@mof-malaysia/myds-react/button";
import { FunctionComponent } from "react";
import Storybook from "@/icons/storybook";
import Github from "@/icons/github";
import ArrowOutgoing from "@/icons/arrow-outgoing";

interface QuicklinksProps {
  links: {
    storybook?: string;
    source?: string;
  };
}

const Quicklinks: FunctionComponent<QuicklinksProps> = ({ links }) => {
  return (
    <div className="flex justify-end">
      {links.source && (
        <Button
          variant="unset"
          size="small"
          render={<Link href={links.source} underline="none" newTab />}
        >
          <ButtonIcon>
            <Github />
          </ButtonIcon>
          Source
          <ButtonIcon>
            <ArrowOutgoing />
          </ButtonIcon>
        </Button>
      )}

      {links.storybook && (
        <Button
          variant="unset"
          size="small"
          render={<Link href={links.storybook} underline="none" newTab />}
        >
          <ButtonIcon>
            <Storybook />
          </ButtonIcon>
          Storybook
          <ButtonIcon>
            <ArrowOutgoing />
          </ButtonIcon>
        </Button>
      )}
    </div>
  );
};

export { Quicklinks };
