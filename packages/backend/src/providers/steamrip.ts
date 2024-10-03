import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://steamrip.com/";

export function generateUrl({ query }: { query: string }) {
  const urlObj = new URL(baseUrl);

  urlObj.searchParams.set("s", query);

  const urlString = urlObj.toString();
  console.log(`Generated URL: ${urlString}`);
  return urlString;
}

export function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("#masonry-grid div.post-element");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el)
        .find("div.slide a .screen-reader-text")
        .text()
        .split("Free Download")[0]!
        .trim();
      const link = baseUrl + $(el).find("div.slide a").attr("href")!.trim();
      const icon = undefined; //$(el).find("div.slide").attr("data-back")!;
      console.log(`Parsed result - Title: ${title}, Link: ${link}, Icon: ${icon}`);
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
  id: "steamrip",
  name: "SteamRIP",
  category: "Games",

  parsePage,
  generateUrl,
} as ProviderExports;
