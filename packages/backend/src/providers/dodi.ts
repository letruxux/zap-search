import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { webSearch } from "../utils";

const baseUrl = "https://dodi-repacks.site/";

export function generateUrl({ query }: { query: string }) {
  return `site:${baseUrl} ${query}`;
}

export async function fetchResults(query: string): Promise<BaseResult[]> {
  const queryResult = await webSearch(query);

  const dataResults: BaseResult[] = [];

  queryResult.forEach((result) => {
    /* oh gosh why is this so bad... */
    if (
      result.link.trim() !== baseUrl &&
      !result.link.endsWith("upcoming-repacks/") &&
      !result.link.includes("all-repacks-") &&
      !result.link.includes("/page/") &&
      !/^\d+\/\d(?!\/)/.test(result.link.replace(baseUrl, "")) &&
      result.title.length > 1 &&
      result.title.trim() !== "DODI Repacks"
    ) {
      const title = result.title
        .trim()
        .replace(/^\d+\s*-\s*/, "")
        .trim();
      const link = result.link;
      const icon = undefined;
      const data: BaseResult = {
        title,
        link,
        icon,
      };
      dataResults.push(data);
    }
  });

  return dataResults;
}

export default {
  baseUrl,
  action: "Download",
  id: "dodi",
  name: "Dodi Repacks",
  category: "Games",
  possibleDownloadTypes: ["direct", "torrent"],

  fetchResults,
  generateUrl,
} as ProviderExports;
