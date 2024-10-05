import { webSearch } from "../utils";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://audioz.download";

export function generateUrl({ query }: { query: string }) {
  const urlString = `site:${baseUrl} ${query}`;
  console.log(`Generated URL: ${urlString}`);
  return urlString;
}

export async function fetchResults(query: string): Promise<BaseResult[]> {
  const dataResults: BaseResult[] = await webSearch(query);

  return dataResults
    .filter((e) => {
      return (
        e.link.includes("/samples/") ||
        e.link.includes("/software") ||
        e.link.includes("/vj-software")
      );
    })
    .map((e) => {
      let title = e.title;
      if (title.toLowerCase().startsWith("download ")) {
        title = title.replace("Download ", "");
      }
      if (title.toLowerCase().includes(" » audioz")) {
        title = title.replace(" » AudioZ", "");
      }
      if (title.toLowerCase().includes(" - audioz")) {
        title = title.replace(" - Audioz", "").replace(" - AudioZ", "");
      }
      return {
        title: title.trim(),
        link: e.link,
      };
    });
}

export default {
  baseUrl,
  action: "Download",
  id: "audioz",
  name: "Audioz",
  category: "Producing",
  possibleDownloadTypes: ["direct"],

  fetchResults,
  generateUrl,
} as ProviderExports;
