import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { fetchPage, webSearch } from "../utils";

const baseUrl = "https://www.ovagames.com";

export function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?x=0&y=0&s=${encodeURIComponent(query)}`;

  return urlString;
}

function parseHTML(html: string): BaseResult[] {
  const $ = cheerio.load(html);
  const results = $(".home-post-wrap");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h2 a").attr("title")!.slice(18).trim();
      const link = $(el).find("h2 a").attr("href")!.trim();
      const icon = $(el).find(".post-inside a img.thumbnail").attr("src")!;

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

export async function fetchResults(url: string): Promise<BaseResult[]> {
  const query = new URL(url).searchParams.get("s");
  try {
    const html = await fetchPage(url);
    const results = parseHTML(html);
    return results;
  } catch {
    const results = await webSearch(`site:${baseUrl} ${query}`);
    return results;
  }
}

export default {
  baseUrl,
  action: "Download",
  id: "ovagames",
  name: "Ova Games",
  category: "Games",
  possibleDownloadTypes: ["direct"],

  fetchResults,
  generateUrl,
} as ProviderExports;
