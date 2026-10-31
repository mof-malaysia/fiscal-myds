import Steps from "@/components/blocks/steps.astro";

const steps = [
  {
    title: "Semak kelayakan anda",
    description: "Pastikan anda memenuhi syarat permohonan.",
  },
  { title: "Sediakan dokumen anda", value: "documents" },
  {
    title: "Mohon dalam talian",
    description:
      "Log masuk dengan MyDigital ID dan isi borang. Simpan nombor rujukan anda.",
    link: { label: "Buka borang permohonan", href: "#borang" },
  },
  {
    title: "Tunggu keputusan",
    description:
      "Kami memaklumkan keputusan melalui SMS dan e-mel dalam 14 hari bekerja.",
  },
];
const documents =
  "<p>Anda memerlukan:</p><ul><li>MyKad anda</li><li>penyata gaji terkini</li><li>nombor akaun bank atas nama anda</li></ul>";

export default {
  title: "Marketing/Steps",
  component: Steps,
};

export const Default = {
  args: {
    description: "Kebanyakan orang selesai dalam satu sesi.",
    steps,
    action: { label: "Mohon sekarang", href: "#mohon" },
    slots: { documents },
  },
};
export const Well = {
  args: {
    tone: "well",
    title: "Cara mendaftar",
    steps: steps.filter((step) => !step.value).slice(0, 3),
  },
};
export const English = {
  args: {
    lang: "en",
    steps: [
      { title: "Check you're eligible", description: "Read who can apply." },
      {
        title: "Prepare your documents",
        description: "Your MyKad and latest payslip.",
      },
      {
        title: "Apply online",
        description: "It takes about 15 minutes.",
        link: { label: "Start now", href: "#apply" },
      },
    ],
  },
};
