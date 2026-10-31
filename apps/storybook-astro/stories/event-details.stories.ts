import EventDetails from "@/components/blocks/event-details.astro";

const base = {
  date: "Khamis, 12 November 2026",
  time: "9.00 pagi hingga 1.00 petang",
  venue: "Dewan Perdana, Kompleks Kementerian Kewangan, Putrajaya",
  fee: "Percuma",
  registerAction: { label: "Daftar sekarang", href: "#daftar" },
  registerNote: "Pendaftaran ditutup pada 5 November.",
};
const about =
  "<p>Taklimat setengah hari ini menerangkan perubahan cukai, insentif dan bantuan dalam Belanjawan 2027 yang melibatkan perniagaan kecil dan sederhana.</p>";

export default {
  title: "Marketing/Event Details",
  component: EventDetails,
};

export const Default = {
  args: {
    ...base,
    aboutTitle: "Mengenai taklimat ini",
    programme: [
      { time: "8.30 pagi", title: "Pendaftaran dan sarapan" },
      {
        time: "9.00 pagi",
        title: "Ucapan alu-aluan",
        detail: "Ketua Setiausaha Perbendaharaan",
      },
      {
        time: "9.30 pagi",
        title: "Belanjawan 2027: apa yang berubah",
        detail: "Bahagian Analisis Cukai",
      },
      { time: "11.00 pagi", title: "Sesi soal jawab" },
    ],
    slots: { default: about },
  },
};
export const FactsOnly = { args: { ...base, slots: { default: about } } };
export const English = {
  args: {
    lang: "en",
    date: "Thursday, 12 November 2026",
    time: "9 am to 1 pm",
    venue: "Putrajaya and online",
    fee: "Free",
    registerAction: { label: "Register now", href: "#register" },
    programme: [
      { time: "9 am", title: "Welcome" },
      { time: "9.30 am", title: "What Budget 2027 means for you" },
    ],
  },
};
