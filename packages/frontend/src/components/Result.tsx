import { FinalResult, ProviderInfo } from "shared/defs";
import { DownloadIcon, icons, TorrentIcon } from "../icons";
import ImageWithPopup from "./Image";
import HoverTooltip from "./HoverTooltip";

export default function Result({
  result,
  providers,
}: {
  result: FinalResult;
  providers: ProviderInfo[];
}) {
  const provider = providers.find((p) => p.id === result.provider)!;

  const dlIcons = (
    <div className="flex items-center h-full">
      {(provider.possibleDownloadTypes ?? []).map((t, index) => {
        switch (t) {
          case "direct":
            return (
              <HoverTooltip tooltipText="Direct download">
                <DownloadIcon key={index} cn="inline-block ml-0 size-5 ml-1" />
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
        <div className="flex-grow">
          <h2 className="card-title text-2xl font-bold text-primary">{result.title}</h2>
          <p className="text-sm text-base-content opacity-70 truncate">
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
