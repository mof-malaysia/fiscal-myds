import { ComponentProps, FunctionComponent } from "react";
import { clx } from "../../utils";

const SummaryList: FunctionComponent<ComponentProps<"div">> = ({
  children,
  className,
  ...props
}) => (
  <div className={clx("space-y-6", className)} {...props}>
    {children}
  </div>
);

const SummaryListHeader: FunctionComponent<
  ComponentProps<"h2"> & {
    /** Heading level: the page's `h1` is its title, so a list heading is `h2` or below. @default "h2" */
    as?: "h2" | "h3" | "h4";
  }
> = ({ children, className, as: Heading = "h2", ...props }) => (
  <Heading
    className={clx("text-title text-txt-black-900 font-semibold", className)}
    {...props}
  >
    {children}
  </Heading>
);

const SummaryListBody: FunctionComponent<ComponentProps<"table">> = ({
  children,
  className,
  ...props
}) => (
  <table
    className={clx(
      "text-content w-full",
      "min-h-[40px]",
      "relative",
      className,
    )}
    {...props}
  >
    <tbody>{children}</tbody>
  </table>
);

const SummaryListRow: FunctionComponent<ComponentProps<"tr">> = ({
  children,
  className,
  ...props
}) => (
  <tr className={clx("border-otl-gray-200 border-b", className)} {...props}>
    {children}
  </tr>
);

const SummaryListTerm: FunctionComponent<ComponentProps<"td">> = ({
  children,
  className,
  ...props
}) => (
  <th
    // scope equals row here to indicate the header relates to all the row it belongs to
    scope="row"
    className={clx(
      // Ink Secondary: people read the term (DESIGN.md, the Dark-Enough Rule)
      "text-txt-black-700 min-w-[190px] py-3 pr-3 text-left align-top font-medium",
      className,
    )}
    {...props}
  >
    {children}
  </th>
);

const SummaryListDetail: FunctionComponent<ComponentProps<"td">> = ({
  children,
  className,
  ...props
}) => (
  <td
    className={clx("text-txt-black-900 w-full py-3 pr-3 align-top", className)}
    {...props}
  >
    {children}
  </td>
);

const SummaryListAction: FunctionComponent<ComponentProps<"td">> = ({
  children,
  className,
  ...props
}) => (
  <td
    className={clx(
      "py-1.5 pr-3 text-right align-top whitespace-nowrap",
      className,
    )}
    {...props}
  >
    {children}
  </td>
);

const SummaryListAddition: FunctionComponent<ComponentProps<"td">> = ({
  children,
  className,
  ...props
}) => (
  <td
    className={clx("text-txt-black-900 min-w-36 py-2 pr-3", className)}
    {...props}
  >
    {children}
  </td>
);

export {
  SummaryList,
  SummaryListHeader,
  SummaryListBody,
  SummaryListRow,
  SummaryListTerm,
  SummaryListDetail,
  SummaryListAction,
  SummaryListAddition,
};
