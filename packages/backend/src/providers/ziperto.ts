import type { ProviderExports } from "shared/defs";
import type BaseResult from "shared/defs";
import * as cheerio from "cheerio";

const baseUrl = "https://www.ziperto.com";

export function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?s=${encodeURIComponent(query)}`;

  return urlString;
}

export function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("article");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h2 a").text().trim();

      const link = $(el).find("h2 a").attr("href")!.trim();
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

  return dataResults.filter(
    (result) => !result.title.startsWith("Nintendo Switch DLC & Updates ")
  );
}

export default {
  baseUrl,
  action: "Download",
  notice: "(Switch Roms - Beware fake download links)",
  id: "ziperto",
  name: "Ziperto",
  category: "ROMs",
  possibleDownloadTypes: ["direct"],

  generateUrl,
  parsePage,
} as ProviderExports;
