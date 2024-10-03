import * as cheerio from "cheerio";
import type BaseResult from "shared/defs";
import { fetchPage } from "../utils";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://freedium.cfd/";

/* just checks if the url is valid */
export function generateUrl({ query }: { query: string }) {
  try {
    new URL(query);
  } catch {
    throw new Error("Invalid URL");
  }

  return query;
}

export async function fetchResults(ogUrl: string): Promise<BaseResult[]> {
  const finalUrl = `${baseUrl}${ogUrl}`;
  const ogHtml = await fetchPage(ogUrl);

  const $ = cheerio.load(ogHtml);

  const ldJson = JSON.parse($("script[type='application/ld+json']").text());

  const dataResults: BaseResult[] = [
    {
      title: ldJson.name,
      link: finalUrl,
      icon: undefined,
    },
  ];
  console.log(`Parsed ${dataResults.length} results.`);
  return dataResults;
}

export default {
  baseUrl,
  action: "Read",
  id: "medium",
  name: "Medium",
  category: "Reading",

  fetchResults,
  generateUrl,
} as ProviderExports;
