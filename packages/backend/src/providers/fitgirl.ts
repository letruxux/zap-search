import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://fitgirl-repacks.site/";

export function generateUrl({ query }: { query: string | undefined }) {
  const urlObj = new URL(baseUrl);
  if (query) {
    urlObj.searchParams.set("s", query);
  }

  const urlString = urlObj.toString();
  console.log(`Generated URL: ${urlString}`);
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
      console.log(`Parsed result - Title: ${title}, Link: ${link}, Icon: ${icon}`);
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

  console.log(`Parsed ${dataResults.length} results.`);
  return dataResults;
}

export default {
  baseUrl,
  action: "Download",
  id: "fitgirl",
  name: "Fitgirl Repacks",
  category: "Games",

  parsePage,
  generateUrl,
} as ProviderExports;
