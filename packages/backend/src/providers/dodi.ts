import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { webSearch } from "../utils";

const baseUrl = "https://dodi-repacks.site";

function generateUrl({ query }: { query: string }) {
  return `site:${baseUrl} ${query}`;
}

function filterResults(results: BaseResult[]): BaseResult[] {
  return results.filter(
    ({ link, title }) =>
      link.trim() !== baseUrl &&
      !(
        link.endsWith("upcoming-repacks/") ||
        link.includes("all-repacks-") ||
        link.includes("/page/") ||
        /^\d+\/\d(?!\/)/.test(link.replace(baseUrl, "")) ||
        title.length < 1 ||
        title.trim() === "DODI Repacks"
      )
  );
}

async function fetchResults(query: string): Promise<BaseResult[]> {
  const queryResult = await webSearch(query);

  const dataResults: BaseResult[] = [];

  queryResult.forEach((result) => {
    try {
      const _title = result.title
        .trim()
        .replace(/^\d+\s*-\s*/, "")
        .trim();
      const title = _title.endsWith("- DODI Repacks")
        ? _title.slice(0, -16).trim()
        : _title;
      const link = result.link;

      const data: BaseResult = {
        title,
        link,
      };
      dataResults.push(data);
    } catch (e) {
      console.error("Skipping element due to error:", e);
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

  filterResults,
  fetchResults,
  generateUrl,
} as ProviderExports;
