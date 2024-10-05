import { ProviderInfo } from "shared/defs";
import { DownloadIcon, TorrentIcon } from "../icons";
import HoverTooltip from "./HoverTooltip";
import { ClassNameValue, twMerge } from "tailwind-merge";

export default function IconsComponent({
  provider,
  className,
}: {
  provider: ProviderInfo;
  className?: ClassNameValue;
}) {
  return (
    <div className={twMerge("flex items-center justify-center h-full", className)}>
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
}
