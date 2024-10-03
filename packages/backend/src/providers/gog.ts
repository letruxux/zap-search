import type BaseResult from "shared/defs";
import type { ProviderExports } from "shared/defs";

const baseUrl = "https://www.gog-games.to/";

export function generateUrl({ query }: { query: string }) {
  const urlString = `https://www.gog-games.to/search?page=1&search=${encodeURIComponent(
    query
  )}&in_dev_filter=none&sort_by=last_update_desc`;

  console.log(`Generated URL: ${urlString}`);
  return urlString;
}

export function parsePage(page: string): BaseResult[] {
  const results = (
    JSON.parse(page) as {
      data: { slug: string; title: string; image: string }[];
    }
  ).data;
  const dataResults: BaseResult[] = [];

  results.forEach((result) => {
    const title = result.title;
    const link = `${baseUrl}game/${result.slug}`;
    const icon = `https://images.gog-statics.com/${result.image}.webp`;
    console.log(`Parsed result - Title: ${title}, Link: ${link}, Icon: ${icon}`);
    dataResults.push({
      title,
      link,
      icon,
    });
  });

  console.log(`Parsed ${dataResults.length} results.`);
  return dataResults;
}

export default {
  baseUrl,
  action: "Download",
  id: "goggames",
  name: "GOG Games",
  category: "Games",

  parsePage,
  generateUrl,
} as ProviderExports;
