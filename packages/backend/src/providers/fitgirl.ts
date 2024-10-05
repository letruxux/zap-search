import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://fitgirl-repacks.site/";

export function generateUrl({ query }: { query: string }) {
  const urlObj = new URL(baseUrl);

  urlObj.searchParams.set("s", query);

  const urlString = urlObj.toString();
  return urlString;
}

export function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("article");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h1 a").text().trim();

      const link = $(el).find("h1 a").attr("href")!.trim();
      const icon = $(el).find("img").attr("src")!;

      if (!title || !link) {
        console.warn("Skipping element due to missing data:", title);
        return;
      }
      if (
        /* remove non-repacks */
        link.endsWith("pop-repacks/") ||
        link.endsWith("popular-repacks-of-the-year/") ||
        link.endsWith("popular-repacks/") ||
        link.includes("upcoming-repacks") ||
        link.includes("-repacks-a-z")
      ) {
        console.warn("Skipping element due to invalid entry:", link);
        return;
      }
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
} as ProviderExports;
