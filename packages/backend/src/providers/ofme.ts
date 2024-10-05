import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://online-fix.me/index.php";

export function generateUrl({ query }: { query: string }) {
  const urlObj = new URL(baseUrl);

  urlObj.searchParams.set("do", "search");
  urlObj.searchParams.set("subaction", "search");
  urlObj.searchParams.set("story", query);

  const urlString = urlObj.toString();
  console.log(`Generated URL: ${urlString}`);
  return urlString;
}

export function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $(".news.news-search .article.clr");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h2.title").text().trim().slice(0, -8);
      const link = $(el).find(".image a").attr("href")!.trim();
      const icon = undefined; //$(el).find("img.lazyload").attr("data-src")!;

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
  notice: "(Russian - Account required)",
  id: "ofme",
  name: "Online Fix",
  category: "Games",
  possibleDownloadTypes: ["direct", "torrent"],

  parsePage,
  generateUrl,
} as ProviderExports;
