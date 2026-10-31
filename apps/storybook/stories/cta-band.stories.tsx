import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { CtaBand } from "@mof-malaysia/ftds-react/cta-band";

/**
 * ### Overview
 * The closing call to action: title, text, one primary action and an
 * optional secondary one, on a Well (default) or FTDS Blue Wash band. Never a
 * saturated blue block: the primary button is the only fill.
 *
 * ### Usage
 * ```tsx
 * <CtaBand
 *   title="Ready to pay?"
 *   description="It takes about three minutes."
 *   primaryAction={{ label: "Start a payment", href: "/pay" }}
 * />
 * ```
 */
const meta: Meta<typeof CtaBand> = {
  title: "Marketing/Blocks/CtaBand",
  component: CtaBand,
  parameters: { layout: "fullscreen" },
};

export default meta;

const Well = () => (
  <CtaBand
    title="Ready to pay?"
    description="It takes about three minutes. Keep your bill or reference number handy."
    primaryAction={{ label: "Start a payment", href: "#" }}
    secondaryAction={{ label: "Contact us", href: "#" }}
  />
);
export const Default = createRender(Well);

const Wash = () => (
  <CtaBand
    tone="primary"
    title="Daftar sebagai pembekal kerajaan"
    description="Mohon pendaftaran ePerolehan dalam talian dan ikuti status permohonan anda."
    primaryAction={{ label: "Mula mendaftar", href: "#" }}
    secondaryAction={{ label: "Syarat kelayakan", href: "#" }}
  />
);
export const PrimaryWash = createRender(Wash);

export const PrimaryOnly = createRender(() => (
  <CtaBand
    title="Read the full Budget 2027 document"
    primaryAction={{ label: "Download PDF (4.2 MB)", href: "#" }}
  />
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <Well />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Well />
      <Wash />
    </div>
  ),
  "dark",
);
