import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://annas-archive.org";

function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}/search?q=${encodeURIComponent(query!)}`;

  return urlString;
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("a.js-vim-focus.custom-a.flex.items-center.relative");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h3").text().trim();
      const link = baseUrl + $(el).attr("href")!.trim();
      const icon = $(el).find(".flex-none img").attr("src")!;
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
  action: "Read",
  id: "annasarchive",
  name: "Anna's Archive",
  category: "Reading",
  possibleDownloadTypes: ["direct"],

  parsePage,
  generateUrl,
} as ProviderExports;
