import type { ProviderExports } from "shared/defs";
import type BaseResult from "shared/defs";
import * as cheerio from "cheerio";

const baseUrl = "https://w14.monkrus.ws/";

function generateUrl({ query }: { query: string }) {
  const urlObj = new URL(`${baseUrl}search`);
  urlObj.searchParams.set("max-results", "50");

  urlObj.searchParams.set("q", query);

  const urlString = urlObj.toString();
  console.log(`Generated URL: ${urlString}`);
  return urlString;
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $(".blog-posts .date-outer");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h2.post-title").text().trim();
      const link = $(el).find("h2.post-title a").attr("href")!.trim();
      const icon = $(el).find(".post-body img").attr("src")!;
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
  id: "monkrus",
  name: "M0nkrus",
  notice: "(Russian - Adobe / Autodesk)",
  defaultDownloadType: "torrent",
  category: "Software",

  generateUrl,
  parsePage,
} as ProviderExports;
