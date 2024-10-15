import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://androeed.store";

function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}/index.php?m=search&f=s&w=${encodeURIComponent(query)}`;

  return urlString;
}

function filterResults(results: BaseResult[]): BaseResult[] {
  return results.filter((result) => {
    return result.link.includes("/files/") && result.link.endsWith(".html");
  });
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("#content #res a");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find(".text .title").text().trim();

      const link = baseUrl + $(el).attr("href")!.trim();
      const icon = $(el).find(".ico img").attr("src")!;

      dataResults.push({
        title,
        link,
        icon,
      });
    } catch (e) {
      console.error("Skipping element due to error:", e);
    }
  });

  return dataResults;
}

export default {
  baseUrl,
  action: "Download",
  id: "androeed",
  name: "Androeed",
  notice: "(MOD APKs - games & software)",
  category: "Mobile",
  possibleDownloadTypes: ["direct"],

  parsePage,
  generateUrl,
  filterResults,
} as ProviderExports;
