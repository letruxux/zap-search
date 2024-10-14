import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://www.gog-games.to";

interface ApiGame {
  slug: string;
  title: string;
  image: string;
}

interface ApiResponse {
  data: ApiGame[];
}

function generateUrl({ query }: { query: string }) {
  const urlString = `https://www.gog-games.to/search?page=1&in_dev_filter=none&sort_by=last_update_desc&search=${encodeURIComponent(
    query
  )}`;

  return urlString;
}

function parsePage(page: string): BaseResult[] {
  const { data: results } = JSON.parse(page) as ApiResponse;
  const dataResults: BaseResult[] = [];

  results.forEach((result) => {
    const title = result.title;
    const link = `${baseUrl}/game/${result.slug}`;
    const icon = `https://images.gog-statics.com/${result.image}.webp`;

    dataResults.push({
      title,
      link,
      icon,
    });
  });

  return dataResults;
}

export default {
  baseUrl,
  action: "Download",
  id: "goggames",
  name: "GOG Games",
  category: "Games",
  possibleDownloadTypes: ["direct"],

  parsePage,
  generateUrl,
} as ProviderExports;
