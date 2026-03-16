"use client";

import { useState } from "react";
import { CATEGORIES, LEVELS, PROVIDERS, CATEGORY_LABELS, LEVEL_LABELS } from "@/lib/courses";

const CATEGORIES_VISIBLE = 10;
const PROVIDERS_VISIBLE = 6;

export type FilterState = {
  category: string;
  level: string;
  provider: string;
};

export const DEFAULT_FILTERS: FilterState = {
  category: "",
  level: "",
  provider: "",
};

type FiltersProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
};

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-150 ${
        active
          ? "bg-accent text-white border-accent font-medium"
          : "bg-white text-muted border-border hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}

export function Filters({ filters, onChange, totalCount }: FiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const set = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? "" : value });

  const visibleCategories = showAllCategories ? CATEGORIES : CATEGORIES.slice(0, CATEGORIES_VISIBLE);
  const visibleProviders = showAllProviders ? PROVIDERS : PROVIDERS.slice(0, PROVIDERS_VISIBLE);

  const hasAny = filters.category !== "" || filters.level !== "" || filters.provider !== "";

  return (
    <aside className="space-y-6">
      {/* Count + clear */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          <span className="font-semibold text-ink">{totalCount}</span> курсів
        </span>
        {hasAny && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-xs text-accent hover:underline"
          >
            Очистити все
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2.5">Категорія</p>
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((cat) => (
            <FilterChip
              key={cat}
              label={CATEGORY_LABELS[cat] || cat}
              active={filters.category === cat}
              onClick={() => set("category", cat)}
            />
          ))}
        </div>
        {CATEGORIES.length > CATEGORIES_VISIBLE && (
          <button
            onClick={() => setShowAllCategories((v) => !v)}
            className="mt-2 text-xs text-accent hover:underline"
          >
            {showAllCategories ? "Сховати" : `Показати ще ${CATEGORIES.length - CATEGORIES_VISIBLE}`}
          </button>
        )}
      </div>

      {/* Provider */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2.5">Провайдер</p>
        <div className="flex flex-wrap gap-2">
          {visibleProviders.map((provider) => (
            <FilterChip
              key={provider}
              label={provider}
              active={filters.provider === provider}
              onClick={() => set("provider", provider)}
            />
          ))}
        </div>
        {PROVIDERS.length > PROVIDERS_VISIBLE && (
          <button
            onClick={() => setShowAllProviders((v) => !v)}
            className="mt-2 text-xs text-accent hover:underline"
          >
            {showAllProviders ? "Сховати" : `Показати ще ${PROVIDERS.length - PROVIDERS_VISIBLE}`}
          </button>
        )}
      </div>

      {/* Level */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2.5">Рівень</p>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <FilterChip
              key={level}
              label={LEVEL_LABELS[level] || level}
              active={filters.level === level}
              onClick={() => set("level", level)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
