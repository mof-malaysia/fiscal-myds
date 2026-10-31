import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@mof-malaysia/myds-react/icon";
import { useRef } from "react";

interface HorizontalCardProps {
  title?: string;
  children?: React.ReactNode;
}

export default function HorizontalCard({
  title,
  children,
}: HorizontalCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    // Scrolling Container
    <>
      <div
        ref={scrollRef}
        className="hide-scrollbar flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth"
      >
        {children}
      </div>

      {/* Title & Arrows */}
      <div className="flex justify-between">
        <h2 className="text-gray-130 flex items-center text-xs font-medium tracking-[2px]">
          {title}
        </h2>
        <div className="flex justify-end gap-3 pt-6">
          <div className="rounded-full border border-[#E4E4E7] p-2">
            <ChevronLeftIcon className="size-5" onClick={() => scroll(-340)} />
          </div>
          <div className="rounded-full border border-[#E4E4E7] p-2">
            <ChevronRightIcon className="size-5" onClick={() => scroll(340)} />
          </div>
        </div>
      </div>
    </>
  );
}
