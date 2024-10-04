import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { search, OrganicResult, ResultTypes } from "google-sr";
import { fetchPage } from "../utils";

const baseUrl = "https://steamrip.com/";

export function generateUrl({ query }: { query: string }) {
  const urlObj = new URL(baseUrl);

  urlObj.searchParams.set("s", query);

  const urlString = urlObj.toString();
  console.log(`Generated URL: ${urlString}`);
  return urlString;
}

async function mainSearch(url: string): Promise<BaseResult[] | null> {
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
        const icon = undefined; //$(el).find("div.slide").attr("data-back")!;
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
  } catch (e) {
    console.error("Error in mainSearch:", e);
    return null;
  }
}

async function secondaryGoogleSearch(ogQuery: string): Promise<BaseResult[]> {
  const query = `site:${new URL(baseUrl).hostname} ${ogQuery}`;
  const queryResult = await search({
    query,
    resultTypes: [OrganicResult],
  });

  const dataResults: BaseResult[] = [];

  queryResult.forEach((result) => {
    /* oh gosh why is this so bad... */
    if (
      result.type === ResultTypes.OrganicResult &&
      result.link &&
      result.title &&
      result.title.toLowerCase().includes("free download")
    ) {
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
    } else {
      console.log(`Skipping result: ${result.title}`);
    }
  });

  // TODO
  return dataResults;
}

export async function fetchResults(url: string): Promise<BaseResult[]> {
  const main = await mainSearch(url);

  if (main) {
    return main;
  }

  /* use google query instead */
  const query = new URL(url).searchParams.get("s");
  if (!query) {
    throw new Error("Search failed, fallback method failed as well.");
  }

  const googleResults = await secondaryGoogleSearch(query);

  return googleResults;
}

export default {
  baseUrl,
  action: "Download",
  id: "steamrip",
  name: "SteamRIP",
  category: "Games",

  fetchResults,
  generateUrl,
} as ProviderExports;
