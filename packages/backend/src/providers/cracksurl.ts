import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://cracksurl.com";

function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?s=${encodeURIComponent(query)}`;

  return urlString;
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("#content.article article.post");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h2.title a").text().trim();
      const link = $(el).find("h2.title a").attr("href")!.trim();

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

export default {
  baseUrl,
  action: "Download",
  id: "cracksurl",
  name: "CRACKSurl",
  category: "Software",
  possibleDownloadTypes: ["direct", "torrent"],

  parsePage,
  generateUrl,
} as ProviderExports;
