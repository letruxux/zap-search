import type BaseResult from "shared/defs";
import type { GenerateUrlOptions, ProviderExports } from "shared/defs";
import ky, { HTTPError, type Options } from "ky";

export async function fetchPage(url: string, config?: Options) {
  try {
    const res = await ky(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      },
      timeout: 20_000,
      ...(config ?? {}),
    });
    return await res.text();
  } catch (e) {
    if (e instanceof HTTPError) {
      if (
        e.message.includes("403") ||
        e.message.toLocaleLowerCase().includes("forbidden")
      ) {
        throw new Error("Captcha detected, please try again later");
      }
      throw new Error(`${e.response.status} ${e.response.statusText}`);
    }
    throw e;
  }
}

export default async function search(
  provider: ProviderExports,
  options: GenerateUrlOptions
): Promise<BaseResult[]> {
  const url = provider.generateUrl(options);
  let data: BaseResult[] = [];

  /* pass query */
  try {
    if (provider.fetchResults) {
      data = await provider.fetchResults(url);
    }
    if (provider.parsePage) {
      const html = await fetchPage(url);
      data = provider.parsePage(html);
    }
  } catch (e) {
    throw e;
  }

  if (data.length) {
    console.log(`${provider.name} results:`, data.length);
  }

  return data;
}

function cleanString(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

export function relevanceSortResults(query: string, items: BaseResult[]): BaseResult[] {
  const cleanedQuery = cleanString(query);
  const queryKeywords = cleanedQuery.split(" ");

  const rankedIndex = items
    .map((entry) => {
      let points = 0;
      const entryKeywords = entry.title.split(" ");

      const cleanedName = cleanString(entry.title);
      const cleanedKeywords = entryKeywords.map(cleanString);

      if (cleanedName.includes(cleanedQuery)) {
        points += 2;
      }

      queryKeywords.forEach((keyword) => {
        if (cleanedName.includes(keyword)) {
          points += 1;
        }
        if (cleanedKeywords.some((k) => k.includes(keyword))) {
          points += 1;
        }
      });

      return { ...entry, points };
    })
    .sort((a, b) => b.points - a.points);

  return rankedIndex;
}
