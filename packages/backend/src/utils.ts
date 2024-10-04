import type BaseResult from "shared/defs";
import type { GenerateUrlOptions, ProviderExports } from "shared/defs";
import ky, { HTTPError, type Options } from "ky";
import { search as ddgSearchFunc } from "duck-duck-scrape";
import { search as googSearchFunc, OrganicResult } from "google-sr";

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
/** tries google firsrt, then duckduck and returns the first result */
export async function webSearch(query: string) {
  const [googResult, googErr] = await safePromise(
    googSearchFunc({ query, resultTypes: [OrganicResult] })
  );
  if (!googErr && googResult) {
    const resList = googResult
      .filter((e) => e.link && e.title && e.type === "ORGANIC")
      .map((e) => {
        return { link: e.link.trim(), title: e.title.trim() } as BaseResult;
      });
    return resList;
  }

  const [ddgResult, ddgErr] = await safePromise(ddgSearchFunc(query, { safeSearch: -2 }));
  if (!ddgErr && ddgResult) {
    const resList = ddgResult.results.map((e) => {
      return { link: e.url.trim(), title: e.title.trim() } as BaseResult;
    });
    return resList;
  }

  throw new Error("Neither search engines succeeded.");
}

/**
 * Awaits promises and returns the results and errors via array
 * ```
 * const [res, err] = await safePromise(fetch("https://google.com/"));
 *
 * if (err) {
 *   console.error(err);
 *   return;
 * }
 *
 * return res;
 * ```
 */
export async function safePromise<T, E = Error>(
  promise: Promise<T>
): Promise<[T, null] | [null, E]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error as E];
  }
}

export function getHighestResImg(srcset: string): string {
  const sources: {
    url: string;
    width: number;
  }[] = srcset.split(",").map((item) => {
    const [url, widthStr] = item.trim().split(" ");
    return { url, width: parseInt(widthStr, 10) };
  });

  const highestRes = sources.reduce((highest, current) =>
    current.width > highest.width ? current : highest
  );

  return highestRes.url;
}
