import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
} from "@mof-malaysia/myds-react/carousel";

/**
 * ### Overview
 * A dependency-free, accessible carousel built on CSS scroll-snap. People can
 * swipe, use the previous / next buttons, the optional dots, or the arrow keys
 * while focus is inside it. No autoplay by default; when `autoplay` is set it
 * pauses on hover and focus, stops once the user navigates, never runs under
 * reduced motion, and needs `<CarouselPlayToggle />`.
 *
 * ### Usage
 * ```tsx
 * <Carousel aria-label="Featured services">
 *   <CarouselContent>
 *     <CarouselItem className="md:basis-1/2">…</CarouselItem>
 *   </CarouselContent>
 *   <div className="flex items-center gap-2">
 *     <CarouselPrevious />
 *     <CarouselNext />
 *     <CarouselDots />
 *   </div>
 * </Carousel>
 * ```
 */
const meta: Meta<typeof Carousel> = {
  title: "Marketing/Carousel",
  component: Carousel,
  parameters: { layout: "padded" },
};

export default meta;

const slides = [
  {
    title: "Pay bills online",
    text: "Settle fees, fines and assessments from 30 agencies with one MyDigital ID.",
  },
  {
    title: "Track your application",
    text: "See where your claim is and what happens next, without calling.",
  },
  {
    title: "Get reminders",
    text: "We tell you before a payment is due, by email or SMS.",
  },
  {
    title: "Download receipts",
    text: "Every payment has an official receipt you can save or print.",
  },
  {
    title: "Help in BM and English",
    text: "Plain-language guidance at every step, in the language you choose.",
  },
];

const Slide = ({ title, text }: { title: string; text: string }) => (
  <div className="bg-bg-white flex h-full min-h-48 flex-col justify-end gap-2 rounded-lg p-6">
    <h3 className="text-txt-black-900 text-body-lg font-semibold">{title}</h3>
    <p className="text-txt-black-700 text-content">{text}</p>
  </div>
);

const Controls = ({ autoplay = false }: { autoplay?: boolean }) => (
  <div className="flex items-center gap-2">
    <CarouselPrevious />
    <CarouselNext />
    {autoplay && <CarouselPlayToggle />}
    <CarouselDots className="ml-auto" />
  </div>
);

const Single = () => (
  <div className="bg-bg-gray-50 max-w-[720px] p-4">
    <Carousel aria-label="What you can do">
      <CarouselContent>
        {slides.map((s) => (
          <CarouselItem key={s.title}>
            <Slide {...s} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <Controls />
    </Carousel>
  </div>
);
export const Default = createRender(Single);

const Multiple = () => (
  <div className="bg-bg-gray-50 p-4">
    <Carousel aria-label="Featured services">
      <CarouselContent>
        {slides.map((s) => (
          <CarouselItem
            key={s.title}
            className="basis-4/5 md:basis-1/2 lg:basis-1/3"
          >
            <Slide {...s} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <Controls />
    </Carousel>
  </div>
);
export const SeveralPerView = createRender(Multiple);

const Autoplay = () => (
  <div className="bg-bg-gray-50 max-w-[720px] p-4">
    <Carousel aria-label="Announcements" autoplay={5000}>
      <CarouselContent>
        {slides.map((s) => (
          <CarouselItem key={s.title}>
            <Slide {...s} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <Controls autoplay />
    </Carousel>
  </div>
);
export const WithAutoplay = createRender(Autoplay);

const Malay = () => (
  <div className="bg-bg-gray-50 max-w-[720px] p-4">
    <Carousel
      aria-label="Perkhidmatan pilihan"
      labels={{
        previous: "Slaid sebelumnya",
        next: "Slaid seterusnya",
        goTo: (i) => `Pergi ke slaid ${i + 1}`,
        slide: (i, n) => `${i + 1} daripada ${n}`,
      }}
    >
      <CarouselContent>
        {slides.slice(0, 3).map((s) => (
          <CarouselItem key={s.title}>
            <Slide {...s} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <Controls />
    </Carousel>
  </div>
);
export const BahasaMelayu = createRender(Malay);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Multiple />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Multiple />
    </div>
  ),
  "dark",
);
