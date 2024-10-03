import type SearchResult from "shared/defs";
import { Action } from "shared/defs";
import { icons } from "../icons";
import ImageWithPopup from "./Image";

export default function Result({
  result,
  providerAction,
}: {
  result: SearchResult;
  providerAction: Action;
}) {
  return (
    <div className="card bg-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-4">
      <div className="card-body flex flex-row items-center">
        {/* icon */}
        {result.icon && (
          <div className="h-16 mr-4">
            <ImageWithPopup src={result.icon} alt={result.title} />
          </div>
        )}

        {/* title */}
        <div className="flex-grow">
          <h2 className="card-title text-2xl font-bold text-primary">{result.title}</h2>
          <p className="text-sm text-base-content opacity-70 truncate">
            {new URL(result.link).host}
          </p>
        </div>

        {/* button */}
        <div className="card-actions justify-end">
          <a href={result.link} target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary w-[8.735rem]">
              {providerAction} {icons[providerAction]}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
