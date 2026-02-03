import { useState, useEffect } from "react";
import { Faders } from "@phosphor-icons/react";

const PREDEFINED_CATEGORIES = [
  { id: "all", label: "All Categories", icon: "🔍" },
  { id: "Productivity", label: "Productivity", icon: "⚡" },
  { id: "Development", label: "Development", icon: "💻" },
  { id: "Creative Writing", label: "Creative Writing", icon: "✍️" },
  { id: "Data Analysis", label: "Data Analysis", icon: "📊" },
  { id: "Business", label: "Business", icon: "💼" },
  { id: "Education", label: "Education", icon: "📚" },
  { id: "Language", label: "Language", icon: "🌍" },
  { id: "General", label: "General", icon: "📌" },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState(PREDEFINED_CATEGORIES);

  useEffect(() => {
    // En el futuro podríamos cargar categorías dinámicas desde el backend
    // const loadCategories = async () => {
    //   const response = await fetch('/api/community-hub/categories');
    //   const data = await response.json();
    //   setCategories(data.categories);
    // };
    // loadCategories();
  }, []);

  const selectedLabel = categories.find(c => c.id === selectedCategory)?.label || "All Categories";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-theme-bg-primary border border-theme-border rounded-lg text-sm text-theme-text-primary hover:bg-theme-bg-secondary transition-colors"
      >
        <Faders size={16} />
        <span>{selectedLabel}</span>
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-theme-bg-primary border border-theme-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-theme-text-secondary uppercase font-semibold px-3 py-2">
                Filter by Category
              </div>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                    selectedCategory === category.id
                      ? "bg-primary-button/20 text-primary-button"
                      : "text-theme-text-primary hover:bg-theme-bg-secondary"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.label}</span>
                  {selectedCategory === category.id && (
                    <span className="ml-auto text-primary-button">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
