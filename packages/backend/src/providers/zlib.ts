import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { getHighestResImg } from "../utils";

const baseUrl = "https://z-lib.gd";

function generateUrl({ query }: { query: string }) {
  const urlString = `${baseUrl}/s/${query}`;

  return urlString;
}

function filterResults(results: BaseResult[]): BaseResult[] {
  return results.filter(({ link, title }) => link.includes("/book/"));
}

function parsePage(page: string): BaseResult[] {
  const $ = cheerio.load(page);
  const results = $("#searchResultBox .resItemBox.exactMatch");
  const dataResults: BaseResult[] = [];

  results.each((_, el) => {
    try {
      const title = $(el).find("h3 a").text().trim();
      const link = baseUrl + $(el).find("h3 a").attr("href")!.trim();
      const icon = getHighestResImg($(el).find(".itemCover a img").attr("data-srcset")!);

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
  action: "Read",
  id: "zlib",
  name: "ZLibrary",
  category: "Reading",
  possibleDownloadTypes: ["direct"],

  parsePage,
  generateUrl,
  filterResults,
} as ProviderExports;
