import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { fetchPage, webSearch } from "../utils";

const baseUrl = "https://steamrip.com";

export function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?s=${encodeURIComponent(query)}`;

  return urlString;
}

async function scrapeSearch(url: string): Promise<BaseResult[] | null> {
  try {
    const page = await fetchPage(url);
    const $ = cheerio.load(page);
    const results = $("#masonry-grid div.post-element");
    const dataResults: BaseResult[] = [];

    results.each((_, el) => {
      try {
        const title = $(el)
          .find("div.slide a .screen-reader-text")
          .text()
          .split("Free Download")[0]!
          .trim();
        const link = baseUrl + $(el).find("div.slide a").attr("href")!.trim();

        dataResults.push({
          title,
          link,
        });
      } catch (e) {
        console.error("Skipping element due to error:", e);
      }
    });

    return dataResults;
  } catch (e) {
    console.error("Error while processing, using fallback.");
    return null;
  }
}

async function engineSearch(ogQuery: string): Promise<BaseResult[]> {
  const query = `site:${new URL(baseUrl).hostname} ${ogQuery}`;
  const queryResult = await webSearch(query);

  const dataResults: BaseResult[] = [];

  queryResult.forEach((result) => {
    if (result.title.toLowerCase().includes("free download")) {
      const title = result.title
        .replace(" Free Download", "")
        .replace(" - SteamRIP", "")
        .replace(/\s+/g, " ")
        .trim();
      const link = result.link;
      const icon = undefined;
      const data: BaseResult = {
        title,
        link,
        icon,
      };
      dataResults.push(data);
    }
  });

  return dataResults;
}

export async function fetchResults(url: string): Promise<BaseResult[]> {
  const query = new URL(url).searchParams.get("s");

  if (!query) {
    throw new Error("Search failed, invalid query passed.");
  }

  const webResults = await engineSearch(query);
  if (webResults) {
    return webResults;
  }

  const scrapedResults = await scrapeSearch(url);

  return scrapedResults;
}

export default {
  baseUrl,
  action: "Download",
  id: "steamrip",
  name: "SteamRIP",
  category: "Games",
  possibleDownloadTypes: ["direct"],

  fetchResults,
  generateUrl,
} as ProviderExports;
