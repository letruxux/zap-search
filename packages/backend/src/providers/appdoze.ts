import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://appdoze.com";

function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?s=${encodeURIComponent(query)}`;

  return urlString;
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $(`#main-site .section a[href^=\"${baseUrl}\"]`);
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find(".title").text().trim();
      const link = $(el).attr("href")!.trim();
      const icon = $(el).find("img.wp-post-image").attr("src")!;

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
  id: "appdoze",
  name: "AppDoze",
  category: "Software",
  possibleDownloadTypes: ["direct", "torrent"],

  parsePage,
  generateUrl,
} as ProviderExports;
