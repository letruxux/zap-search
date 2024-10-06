import { FinalResult, ProviderInfo } from "shared/defs";
import { icons } from "../icons";
import ImageWithPopup from "./Image";
import HoverTooltip from "./HoverTooltip";
import { useEffect, useRef, useState } from "react";
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [truncateText, setTruncateText] = useState<boolean>(false);

  const fixedTitle =
    result.title
      .replace(/^\.+\s*/, "") // Remove leading dots and spaces
      .replace(/(\([^)]*$|\[[^\]]*$|{[^}]*$)/g, (match) => {
        const closingChar = match[0] === "(" ? ")" : match[0] === "[" ? "]" : "}";
        return match + closingChar;
      }) + (result.title.startsWith(".") ? "..." : ""); // Add ellipsis if original title started with dots

  const provider = providers.find((p) => p.id === result.provider)!;

  useEffect(() => {
    function updateTruncate() {
      const mustTruncate = (titleRef.current?.clientHeight ?? 0) > 32;
      console.log("Truncating", mustTruncate);
      if (truncateText !== mustTruncate) setTruncateText(mustTruncate);
    }

    window.onresize = () => updateTruncate();

    updateTruncate();
  }, []);

  return (
    <div className="card transition-shadow bg-base-300 shadow-xl hover:shadow-2xl duration-300 mt-4 first:mt-2">
      <div className="card-body flex flex-col sm:flex-row items-start sm:items-center">
        {/* icon */}
        {result.icon && (
          <div className="h-16 mb-4 w-auto sm:aspect-square sm:mb-0 sm:mr-4">
            <ImageWithPopup
              src={result.icon}
              alt={result.title}
              className="w-auto sm:w-16"
            />
          </div>
        )}

        {/* title and info */}
        <div className="flex-grow w-full sm:max-w-[calc(100%-10rem)]">
          <h2
            className={clsx("card-title text-xl sm:text-2xl font-bold break-words", {
              "text-primary": highlight,
              truncate: truncateText,
            })}
            ref={titleRef}
          >
            {truncateText ? (
              <HoverTooltip
                tooltipText={
                  <span className="font-normal break-normal text-base">
                    {result.title}
                  </span>
                }
              >
                {fixedTitle}
              </HoverTooltip>
            ) : (
              <span>{fixedTitle}</span>
            )}
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
              className={clsx("btn w-full sm:w-[8.735rem]", {
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
