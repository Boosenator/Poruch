"use client";

import type { Category } from "@/lib/categories";

type CategoryFilterProps = {
  categories: readonly Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
  counts: Record<string, number>;
};

export function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
  counts,
}: CategoryFilterProps) {
  const visibleCategories = categories.filter(
    (category) => category.id === "all" || (counts[category.id] ?? 0) > 0,
  );

  return (
    <div className="overflow-hidden">
      <div className="flex flex-wrap gap-2 py-1">
        {visibleCategories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={[
                "flex h-10 max-w-full items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#C1440E] text-white"
                  : "border border-neutral-200 bg-white text-neutral-800 hover:border-[#C1440E]/40",
              ].join(" ")}
            >
              <span>{category.label}</span>
              <span
                className={[
                  "min-w-6 rounded-full px-2 py-0.5 text-xs",
                  isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500",
                ].join(" ")}
              >
                {counts[category.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
