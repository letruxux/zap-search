import { FinalResult, ProviderInfo } from "shared/defs";
import { DownloadIcon, icons, TorrentIcon } from "../icons";
import ImageWithPopup from "./Image";
import HoverTooltip from "./HoverTooltip";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Result({
  result,
  providers,
}: {
  result: FinalResult;
  providers: ProviderInfo[];
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titlePopup, setTitlePopup] = useState<boolean>(false);

  const fixedTitle =
    result.title
      .replace(/^\.+\s*/, "") // Remove leading dots and spaces
      .replace(/(\([^)]*$|\[[^\]]*$|{[^}]*$)/g, (match) => {
        const closingChar = match[0] === "(" ? ")" : match[0] === "[" ? "]" : "}";
        return match + closingChar;
      }) + (result.title.startsWith(".") ? "..." : ""); // Add ellipsis if original title started with dots

  const provider = providers.find((p) => p.id === result.provider)!;

  useEffect(() => {
    const mustTruncate = (titleRef.current?.offsetHeight ?? 0) > 32;
    if (mustTruncate) setTitlePopup(true);
  });

  const dlIcons = (
    <div className="flex items-center h-full">
      {(provider.possibleDownloadTypes ?? []).map((t, index) => {
        switch (t) {
          case "direct":
            return (
              <HoverTooltip key={index} tooltipText="Direct download">
                <DownloadIcon cn="inline-block ml-0 size-5 ml-1" />
              </HoverTooltip>
            );
          case "torrent":
            return (
              <HoverTooltip key={index} tooltipText="Torrent">
                <TorrentIcon cn="inline-block size-5 ml-1" />
              </HoverTooltip>
            );
          default:
            return null;
        }
      })}
    </div>
  );

  const iconsComponent = (
    <div className="flex items-center justify-center h-full">{dlIcons}</div>
  );

  return (
    <div className="card bg-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-4 first:mt-2">
      <div className="card-body flex flex-row items-center">
        {/* icon */}
        {result.icon && (
          <div className="h-16 mr-4">
            <ImageWithPopup src={result.icon} alt={result.title} />
          </div>
        )}

        {/* title */}
        <div
          className={clsx("flex-grow max-w-[calc(100%-10rem)]", { truncate: titlePopup })}
        >
          <h2 className="card-title text-2xl font-bold text-primary" ref={titleRef}>
            {titlePopup ? (
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
              <span className="">{fixedTitle}</span>
            )}
          </h2>
          <p className="text-sm text-base-content opacity-70">
            <div className="flex flex-row space-x-2">
              {new URL(result.link).host} {iconsComponent}
            </div>
          </p>
        </div>

        {/* button */}
        <div className="card-actions justify-end">
          <a href={result.link} target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary w-[8.735rem]">
              {provider.action} {icons[provider.action]}
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
