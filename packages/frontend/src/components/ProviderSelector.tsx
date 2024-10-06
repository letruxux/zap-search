import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { emojis } from "shared/defs";
import type { Category, ProviderInfo } from "shared/defs";

interface ProviderSelectorProps {
  providers: ProviderInfo[];
  selectedProviders: ProviderInfo[];
  handleProviderChange: (provider: ProviderInfo) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  selectedProviders,
  handleProviderChange,
}) => {
  const groupedProviders = providers.reduce((acc, provider) => {
    (acc[provider.category] = acc[provider.category] || []).push(provider);
    return acc;
  }, {} as Record<Category, ProviderInfo[]>);

  const [expandedCategories, setExpandedCategories] = useState<Record<Category, boolean>>(
    () => {
      const saved = localStorage.getItem("expandedCategories");
      return saved
        ? JSON.parse(saved)
        : Object.keys(groupedProviders).reduce((acc, category) => {
            acc[category as Category] = true;
            return acc;
          }, {} as Record<Category, boolean>);
    }
  );

  useEffect(() => {
    localStorage.setItem("expandedCategories", JSON.stringify(expandedCategories));
  }, [expandedCategories]);

  const toggleCategory = (category: Category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="dropdown input-bordered w-full mb-2 z-10">
      <label
        tabIndex={0}
        className="btn w-full justify-between btn-bordered bg-base-100 border border-white border-opacity-10 hover:bg-base-100 hover:border-white hover:border-opacity-10 font-normal"
      >
        <span className="max-w-[calc(100%-28px)] text-left">
          {selectedProviders.length > 0
            ? `(${selectedProviders.length}) ` +
              selectedProviders.map((e) => e.name).join(", ")
            : "Select providers"}
        </span>
        <span className="ml-2 w-3">▼</span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full overflow-y-auto z-10"
      >
        {Object.entries(groupedProviders).map(([category, categoryProviders]) => (
          <React.Fragment key={category}>
            <li
              className="menu-title text-base-content cursor-pointer hover:bg-base-200 pl-2 rounded-lg"
              onClick={() => toggleCategory(category as Category)}
            >
              <span>
                {emojis[category as Category]} {category}{" "}
                <span className="text-gray-600 text-sm">
                  {!expandedCategories[category as Category] && "(collapsed)"}
                </span>
              </span>
            </li>
            {expandedCategories[category as Category] &&
              categoryProviders.map((provider) => {
                const sameAction =
                  selectedProviders.length > 0
                    ? selectedProviders.some((e) => e.category === provider.category)
                    : true;
                return (
                  <li key={provider.id} className="w-full">
                    <label className="label cursor-pointer flex flex-col items-start">
                      <div
                        className={clsx("flex items-center w-full", {
                          "cursor-not-allowed": !sameAction,
                        })}
                      >
                        <input
                          type="checkbox"
                          className="checkbox mr-2"
                          checked={selectedProviders
                            .map((e) => e.id)
                            .includes(provider.id)}
                          disabled={!sameAction}
                          onChange={() => {
                            if (sameAction) {
                              handleProviderChange(provider);
                            }
                          }}
                        />
                        <span className="flex-grow">
                          {provider.name} {provider.notice}
                        </span>
                      </div>
                    </label>
                  </li>
                );
              })}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default ProviderSelector;
