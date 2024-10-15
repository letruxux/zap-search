import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";
import { webSearch } from "../utils";

const baseUrl = "https://modyolo.com";

function generateUrl({ query }: { query: string }) {
  return query;
}

function filterResults(results: BaseResult[]): BaseResult[] {
  return results.filter((result) => {
    return (
      !result.link.includes("/developer/") &&
      !result.link.includes("/games/") &&
      result.link.endsWith(".html")
    );
  });
}

function fetchResults(query: string): Promise<BaseResult[]> {
  return webSearch(`site:${baseUrl} ${query}`).then((results) =>
    results.map((e) => ({
      ...e,
      title: e.title.replace(" - modyolo.com", "").trim(),
    }))
  );
}

export default {
  baseUrl,
  action: "Download",
  id: "modyolo",
  name: "MODYOLO",
  notice: "(MOD APKs - games & software)",
  category: "Mobile",
  possibleDownloadTypes: ["direct"],

  fetchResults,
  generateUrl,
  filterResults,
} as ProviderExports;
