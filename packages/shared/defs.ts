/** result returned by search */
export default interface BaseResult {
  title: string;
  link: string;
  icon?: string;
}

/** options when generating url / query */
export interface GenerateUrlOptions {
  query: string;
}

/** action a provider can do, used just for UI */
export type Action = "Download" | "Watch" | "Read";

/** type of download a provider can do, unused rn */
export type DownloadType = "torrent" | "direct" | "magnet";

/** emojis for various categories */
export const emojis: Record<Category, string> = {
  Games: "🎮",
  ROMs: "💾",
  Software: "💻",
  Video: "📹",
  Reading: "📖",
};

/** provider category */
export type Category = "Games" | "ROMs" | "Software" | "Video" | "Reading";

/** data the api returns */
export interface ProviderInfo {
  name: string;
  id: string;
  action: Action;
  category: Category;
  baseUrl: string;
  notice?: string;
}

export interface RawProviderExports {
  generateUrl: (args: GenerateUrlOptions) => string;
}

/** provider exports */
export type ProviderExports = RawProviderExports &
  (
    | {
        parsePage: (page: string) => BaseResult[];
        fetchResults?: never;
      }
    | {
        fetchResults: (query: string) => Promise<BaseResult[]>;
        parsePage?: never;
      }
  ) &
  ProviderInfo;

/** provider search settings */
export type GenerateUrlFunctionParams = {
  query: string;
};
