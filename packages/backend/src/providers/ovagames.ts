import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://www.ovagames.com";

export function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?x=0&y=0&s=${encodeURIComponent(query)}`;

  return urlString;
}

export function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $(".home-post-wrap");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h2 a").attr("title")!.slice(18).trim();
      const link = $(el).find("h2 a").attr("href")!.trim();
      const icon = $(el).find(".post-inside a img.thumbnail").attr("src")!;

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
  id: "ovagames",
  name: "Ova Games",
  category: "Games",
  possibleDownloadTypes: ["direct"],

  parsePage,
  generateUrl,
} as ProviderExports;
