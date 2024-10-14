import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://fitgirl-repacks.site";

function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?s=${encodeURIComponent(query)}`;

  return urlString;
}

function filterResults(results: BaseResult[]): BaseResult[] {
  return results.filter(
    ({ link }) =>
      !(
        link.endsWith("pop-repacks/") ||
        link.endsWith("popular-repacks-of-the-year/") ||
        link.endsWith("popular-repacks/") ||
        link.includes("upcoming-repacks") ||
        link.includes("-repacks-a-z")
      )
  );
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("article");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h1 a").text().trim();
      const link = $(el).find("h1 a").attr("href")!.trim();
      const icon = $(el).find("img").attr("src")!;

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
  id: "fitgirl",
  name: "Fitgirl Repacks",
  category: "Games",
  possibleDownloadTypes: ["direct", "torrent"],

  parsePage,
  generateUrl,
  filterResults,
} as ProviderExports;
