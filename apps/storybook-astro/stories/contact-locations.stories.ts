import ContactLocations from "@/components/blocks/contact-locations.astro";
import { helpline, offices } from "./_logo";

export default {
  title: "Marketing/Contact Locations",
  component: ContactLocations,
};

export const Default = {
  args: {
    channels: helpline,
    offices: offices.slice(0, 2),
    officesTitle: "Pejabat kami",
  },
};
export const ChannelsOnly = {
  args: { title: "Talian bantuan", channels: helpline.slice(0, 3) },
};
export const OfficesOnly = { args: { title: "Pejabat kami", offices } };
export const English = {
  args: {
    lang: "en",
    channels: [
      {
        kind: "phone",
        value: "03-8000 8000",
        detail: "Monday to Friday, 8 am to 5 pm",
      },
      { kind: "email", value: "enquiries@mof.gov.my" },
    ],
  },
};
