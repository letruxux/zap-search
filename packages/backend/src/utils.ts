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
        e.message.toLocaleLowerCase().includes("403") ||
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

  /* pass query */
  try {
    if (provider.fetchResults) {
      const data = await provider.fetchResults(url);
      return data;
    }
    if (provider.parsePage) {
      const html = await fetchPage(url);
      const data = provider.parsePage(html);
      return data;
    }
  } catch (e) {
    throw e;
  }

  return [];
}
