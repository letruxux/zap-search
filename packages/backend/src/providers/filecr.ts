import type { ProviderExports } from "shared/defs";
import type BaseResult from "shared/defs";
import * as cheerio from "cheerio";

const baseUrl = "https://filecr.com/";

export function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}search/?primary=ms-windows&q=${encodeURIComponent(query)}`;

  console.log(`Generated URL: ${urlString}`);
  return urlString;
}

export function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $('section.products .product-list div div[class*="card_wrap__"]');
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("a img").attr("alt")!.trim();
      const link = baseUrl.slice(0, -1) + $(el).find("a").attr("href")!.trim();
      const icon = baseUrl.slice(0, -1) + $(el).find("a img").attr("src")!;
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
  id: "filecr",
  name: "FileCR",
  category: "Software",

  generateUrl,
  parsePage,
} as ProviderExports;
