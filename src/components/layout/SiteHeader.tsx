import Link from "next/link";
import { Bookmark, List, MapIcon, MapPin, Sparkles } from "lucide-react";

type SiteHeaderProps = {
  active?: "map" | "list" | "saved" | "suggest";
};

const navItems = [
  { id: "map", label: "Карта", href: "/", icon: MapIcon },
  { id: "list", label: "Список", href: "/list", icon: List },
  { id: "saved", label: "Збережені", href: "/saved", icon: Bookmark },
] as const;

export function SiteHeader({ active = "map" }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-[#FAF9F7]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-left">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#C1440E] text-white">
            <MapPin size={21} />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">Поруч</p>
            <p className="text-xs text-neutral-500">Прага</p>
          </div>
        </Link>

        <nav className="hidden items-center rounded-full border border-neutral-200 bg-white p-1 text-sm font-medium text-neutral-600 sm:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={[
                  "flex h-9 items-center gap-2 rounded-full px-4 transition-colors",
                  isActive ? "bg-[#C1440E] text-white" : "hover:bg-neutral-100",
                ].join(" ")}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/suggest"
          className={[
            "flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors sm:px-4",
            active === "suggest"
              ? "border border-[#C1440E] bg-[#FDF0EB] text-[#C1440E]"
              : "bg-[#C1440E] text-white hover:bg-[#A33A0B]",
          ].join(" ")}
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">Додати місце</span>
        </Link>
      </div>

      <nav className="grid grid-cols-3 border-t border-neutral-200 bg-white text-sm font-medium text-neutral-600 sm:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "flex h-11 items-center justify-center gap-2",
                isActive ? "text-[#C1440E]" : "text-neutral-600",
              ].join(" ")}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
