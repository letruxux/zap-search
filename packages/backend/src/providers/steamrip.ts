import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { fetchPage, webSearch } from "../utils";

const baseUrl = "https://steamrip.com";

export function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?s=${encodeURIComponent(query)}`;

  return urlString;
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("#masonry-grid div.post-element");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("div.slide a .screen-reader-text").text().trim();
      const link = baseUrl + "/" + $(el).find("div.slide a").attr("href")!.trim();

      dataResults.push({
        title,
        link,
      });
    } catch (e) {
      console.error("Skipping element due to error:", e);
    }
  });

  return dataResults;
}

function filterResults(results: BaseResult[]): BaseResult[] {
  return results
    .filter(
      (e) =>
        !e.link.endsWith("/games-list-page/") &&
        !e.link.includes("/page/") &&
        !e.link.includes("/category/") &&
        !e.link.endsWith("/top-games/")
    )
    .map((result) => {
      return {
        title: result.title
          .replace(" Free Download", "")
          .replace(" - SteamRIP", "")
          .replace(/\s+/g, " ")
          .trim(),
        link: result.link,
      };
    });
}

export default {
  baseUrl,
  action: "Download",
  id: "steamrip",
  name: "SteamRIP",
  category: "Games",
  possibleDownloadTypes: ["direct"],

  parsePage,
  filterResults,
  generateUrl,
} as ProviderExports;
