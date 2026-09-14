"use client";

import { CATEGORIES } from "@/services/blog.service";

export default function CategoryFilter({ value = "", onChange }) {
  const options = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === "All" ? value === "" : value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option === "All" ? "" : option)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              active
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
