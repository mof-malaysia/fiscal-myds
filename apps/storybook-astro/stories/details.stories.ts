import Details from "@/components/ui/details.astro";

export default {
  title: "Core/Details",
  component: Details,
  parameters: { layout: "padded" },
};

export const Default = {
  args: {
    summary: "Saya tidak mempunyai MyKad",
    slots: {
      default:
        "Jika anda pemastautin tetap, gunakan nombor pada kad MyPR anda. Jika anda bukan warganegara Malaysia, mohon dengan nombor pasport anda.",
    },
  },
};
export const Open = {
  args: {
    summary: "Di mana nombor cukai pendapatan saya?",
    open: true,
    slots: {
      default:
        "Nombor itu bermula dengan IG dan dicetak pada notis taksiran anda.",
    },
  },
};
