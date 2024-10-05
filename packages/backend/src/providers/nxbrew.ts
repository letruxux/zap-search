import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://www.nxbrew.com/";

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

  return dataResults;
}

export default {
  baseUrl,
  action: "Download",
  notice: "(Switch Roms)",
  id: "nxbrew",
  name: "Nxbrew",
  category: "ROMs",
  possibleDownloadTypes: ["direct", "torrent"],

  parsePage,
  generateUrl,
} as ProviderExports;
