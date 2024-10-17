import { filter } from "cheerio/dist/commonjs/api/traversing";
import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

/* this does not crawl, nor does collect (as the program works) the website. 
It just returns the engine search results for it, to follow the appnee TOS:
Any manual or automated whole-website collecting/crawling behaviors are strictly prohibited.
*/

const baseUrl = "https://appnee.com";

function generateUrl({ query }: { query: string }) {
  return query;
}

function filterResults(results: BaseResult[]): BaseResult[] {
  console.log(results.map((e) => e.link));
  return results
    .filter(
      ({ link }) =>
        !(
          link.includes("/tag/") ||
          link.includes("/category/") ||
          link.endsWith("/about/") ||
          link.endsWith("/publishing/") ||
          link.endsWith("/faq/") ||
          link.endsWith("/dmca/") ||
          link.endsWith("/contact/") ||
          link.endsWith("/history/") ||
          link.endsWith("/author/") ||
          /\d{4}\/\d{2}\/\d{2}\/?$/.test(link) ||
          /\d{4}\/\d{2}\/?$/.test(link)
        )
    )
    .map((e) => ({ ...e, title: e.title.replace("- AppNee", "").trim() }));
}

async function fetchResults(page: string): Promise<BaseResult[]> {
  throw new Error("Use web search");
}

export default {
  baseUrl,
  action: "Download",
  id: "appnee",
  name: "AppNee",
  category: "Software",
  possibleDownloadTypes: ["direct"],

  fetchResults,
  generateUrl,
  filterResults,
} as ProviderExports;
