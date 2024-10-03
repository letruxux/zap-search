import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://www.nswrom.com/";

export function generateUrl({ query }: { query: string }) {
  const urlObj = new URL(baseUrl);

  urlObj.searchParams.set("s", query);

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
      const title = $(el).find("h3 a").text().trim();

      const link = $(el).find("h3 a").attr("href")!.trim();
      const icon = $(el).find("img").attr("src")!;
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
  notice: "(Switch Roms)",
  id: "nswrom",
  name: "Nswrom",
  category: "ROMs",

  parsePage,
  generateUrl,
} as ProviderExports;
