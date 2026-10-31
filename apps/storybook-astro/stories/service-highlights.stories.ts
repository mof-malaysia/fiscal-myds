import ServiceHighlights from "@/components/blocks/service-highlights.astro";
import MoneyIcon from "@/components/ui/icons/money.astro";
import UserGroupIcon from "@/components/ui/icons/user-group.astro";
import GovtOfficeIcon from "@/components/ui/icons/govt-office.astro";
import DocumentIcon from "@/components/ui/icons/document.astro";

const services = [
  {
    icon: MoneyIcon,
    title: "Bayar bil kerajaan",
    description: "Jelaskan saman, yuran dan taksiran daripada lebih 30 agensi.",
    href: "#bayar",
    facts: ["Dalam talian", "3 minit"],
  },
  {
    icon: UserGroupIcon,
    title: "Semak bantuan tunai",
    description: "Ketahui sama ada isi rumah anda layak menerima bantuan.",
    href: "#bantuan",
    facts: ["Dalam talian", "Percuma"],
    tag: "Dibuka",
  },
  {
    icon: GovtOfficeIcon,
    title: "Daftar sebagai pembekal",
    description: "Daftar syarikat anda untuk membida perolehan kerajaan.",
    href: "#pembekal",
    facts: ["Dalam talian", "Kira-kira 30 minit"],
  },
  {
    icon: DocumentIcon,
    title: "Pekeliling perbendaharaan",
    description: "Pekeliling dan garis panduan terkini untuk agensi kerajaan.",
    href: "#pekeliling",
  },
];

export default {
  title: "Marketing/Service Highlights",
  component: ServiceHighlights,
};

export const Default = {
  args: {
    title: "Perkhidmatan popular",
    description: "Perkara yang paling kerap dicari di laman ini.",
    services: services.slice(0, 3),
  },
};
export const TwoColumnsWell = {
  args: { title: "Perkhidmatan", tone: "well", columns: 2, services },
};
export const WithoutIcons = {
  args: {
    title: "Perkhidmatan popular",
    services: services.map(({ icon: _icon, ...s }) => s).slice(0, 3),
  },
};
