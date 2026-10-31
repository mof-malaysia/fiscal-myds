import PeopleGrid from "@/components/blocks/people-grid.astro";
import { leadership } from "./_logo";

export default {
  title: "Marketing/People Grid",
  component: PeopleGrid,
};

export const Leadership = {
  args: { title: "Kepimpinan", featured: 2, people: leadership },
};
export const Team = {
  args: {
    title: "Pengurusan tertinggi",
    tone: "well",
    people: leadership.slice(2),
  },
};
