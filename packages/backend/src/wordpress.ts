/* currently unused, created for possible future use */

interface ExtraParams {
  context?: "view" | "embed";
  page?: number;
  per_page?: number;
  type?: "post" | "term" | "post-format";

  /** Limit results to items of one or more object subtypes */
  subtype?: any;

  exclude?: number[];
  include?: number[];
}

interface WpResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  _links: {
    self: { embeddable?: boolean; href: string }[];
    about?: { embeddable?: boolean; href: string }[];
    collection?: { embeddable?: boolean; href: string }[];
  };
}

type WpResponse = WpResult[];

export default async function searchWp(
  baseUrl: string,
  query: string,
  extraParams: ExtraParams = {}
): Promise<WpResponse> {
  const url = new URL(`${baseUrl}/wp-json/wp/v2/search`);
  const params = new URLSearchParams();
  params.append("per_page", "20");

  for (const [key, value] of Object.entries(extraParams)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  }

  params.append("search", query);
  url.search = params.toString();

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}
