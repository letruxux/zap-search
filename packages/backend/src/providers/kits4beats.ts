import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://kits4beats.com";

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
      const title = $(el)
        .find("h2.entry-title a")
        .text()
        .trim()
        .replace("Free Download", "")
        .replace(/\s+/g, " ");

      const link = $(el).find("h2.entry-title a").attr("href")!.trim();
      const icon = $(el).find("img.wp-post-image").attr("src")!;

      if (!title || !link) {
        console.warn("Skipping element due to missing data:", title);
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
  id: "kits4beats",
  name: "Kits4Beats",
  category: "Producing",
  possibleDownloadTypes: ["direct"],

  parsePage,
  generateUrl,
} as ProviderExports;
