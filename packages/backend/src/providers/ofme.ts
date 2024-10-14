import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { fetchPage, webSearch } from "../utils";

const baseUrl = "https://online-fix.me/index.php";

export function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}?do=search&subaction=search&s=${encodeURIComponent(
    query
  )}`;

  return urlString;
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $(".news.news-search .article.clr");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h2.title").text().trim().slice(0, -8);
      const link = $(el).find(".image a").attr("href")!.trim();
      const icon = undefined; //$(el).find("img.lazyload").attr("data-src")!;
      /* dont use icon since it has returns a hotlink warning */

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

async function fetchResults(url: string) {
  try {
    const html = await fetchPage(url);

    return parsePage(html);
  } catch (e) {
    console.error("Error while processing, using fallback.", e);

    const query = new URL(url).searchParams.get("s");
    const results = await webSearch(`site:${new URL(baseUrl).hostname} ${query}`);
    return results;
  }
}

export default {
  baseUrl,
  action: "Download",
  notice: "(Russian - Account required)",
  id: "ofme",
  name: "Online Fix",
  category: "Games",
  possibleDownloadTypes: ["direct", "torrent"],

  fetchResults,
  generateUrl,
} as ProviderExports;
