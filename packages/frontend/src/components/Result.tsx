import { FinalResult, ProviderInfo } from "shared/defs";
import { icons } from "../icons";
import ImageWithPopup from "./Image";
import clsx from "clsx";
import IconsComponent from "./IconsComponent";

export default function Result({
  result,
  providers,
  highlight = true,
}: {
  result: FinalResult;
  providers: ProviderInfo[];
  highlight?: boolean;
}) {
  const fixedTitle =
    result.title
      .replace(/^\.+\s*/, "") // Remove leading dots and spaces
      .replace(/(\([^)]*$|\[[^\]]*$|{[^}]*$)/g, (match) => {
        const closingChar = match[0] === "(" ? ")" : match[0] === "[" ? "]" : "}";
        return match + closingChar;
      }) + (result.title.startsWith(".") ? "..." : ""); // Add ellipsis if original title started with dots

  const provider = providers.find((p) => p.id === result.provider)!;

  return (
    <div className="card transition-shadow bg-base-300 shadow-xl hover:shadow-2xl duration-300 mt-4 first:mt-2">
      <div className="card-body flex flex-col sm:flex-row items-start sm:items-center justify-between">
        {/* icon */}
        {result.icon && (
          <div className="h-16 w-auto flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
            <ImageWithPopup
              src={result.icon}
              alt={result.title}
              className="w-auto sm:w-16"
            />
          </div>
        )}

        {/* title and info */}
        <div className="flex-grow w-full sm:max-w-[calc(100%-16rem)]">
          <h2
            className={clsx("card-title text-xl sm:text-2xl font-bold break-words", {
              "text-primary": highlight,
            })}
          >
            <span>{fixedTitle}</span>
          </h2>
          <p className="text-sm text-base-content opacity-70 mt-2">
            <div className="flex items-center flex-row space-x-2">
              {new URL(result.link).host} <IconsComponent provider={provider} />
            </div>
          </p>
        </div>

        {/* button */}
        <div className="card-actions justify-start sm:justify-end mt-4 sm:mt-0 w-full sm:w-auto">
          <a
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <button
              className={clsx("btn w-full sm:min-w-[140px] sm:w-auto", {
                "btn-primary": highlight,
                "btn-outline": !highlight,
              })}
            >
              {provider.action} {icons[provider.action]}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
