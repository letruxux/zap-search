import BaseResult, { ProviderExports, type ProviderInfo } from "shared/defs";
import search, { openBrowser, relevanceSortResults, safePromise } from "./utils";
import allProviders from "./providers";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/serve-static";
import { rateLimiter } from "hono-rate-limiter";
import { serve } from "bun";

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

type Arg = "--no-browser" | "--dev";

const app = new Hono();
const port = 5180;

const cache = new Map<string, { data: BaseResult[]; expiration: number }>();
const CACHE_TTL = 5 * 60 * 1000; // cache for 5 minutes

const cmdArgs = Bun.argv.slice(2) as Arg[];
const distFolderPath = "./dist";
const devMode = cmdArgs.includes("--dev");

const distFolder = Bun.file(distFolderPath);
const indexFile = Bun.file(`${distFolderPath}/index.html`);
if (!distFolder.exists() || !indexFile.exists()) {
  throw new Error(
    `"${distFolderPath}" folder or its files were not found. Make sure you haven\'t moved the dist folder or the executable.`
  );
}

const limiter = rateLimiter({
  windowMs: 3 * 1000 /* 3 seconds */,
  limit: 1 /* 1 request per 3 seconds */,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "",
});

/* helper function to get results from instance */
async function getResults(providerInstance: ProviderExports, query: string) {
  const resultsPromise = search(providerInstance, { query }).then((r) => {
    return r.map((e) => ({
      ...e,
      provider: providerInstance.id,
    }));
  });

  return await resultsPromise;
}

app.use("/api/*", cors());

app.get("/api/search", limiter, async (c) => {
  try {
    const queryParams = c.req.query();
    const { provider, query } = queryParams;
    const cacheKey = `${provider}:${query}:${provider}`;

    if (!query || !provider) {
      return c.status(400);
    }

    const providerIds = provider.split(",");
    const providerInstances = allProviders.filter((p) => providerIds.includes(p.id));

    if (providerInstances.length !== providerIds.length) {
      return c.json({ error: "Provider not found" }, 404);
    }

    console.log(`Searching "${query}" on ${providerInstances.length} sites.`);

    /* check cache */
    const cached = cache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiration > now) {
      console.log("Returning cached results for", query);
      return c.json({
        error: null,
        data: cached.data,
      });
    }

    const searchPromises = providerInstances.map(async (pr) => {
      const [res, err] = await safePromise(getResults(pr, query));
      return (res as BaseResult[]) || (err as Error);
    });

    const unflattenedResults = (await Promise.all(searchPromises)).flat();
    const errors = unflattenedResults.filter((e) => e instanceof Error) as Error[];
    const successfulResults = unflattenedResults.filter(
      (e) => !(e instanceof Error)
    ) as BaseResult[];

    const results = relevanceSortResults(query, successfulResults);
    console.log(results.length, "total results found");

    /* if theres only 1 provider, return the error */
    if (results.length === 0 && errors.length === providerInstances.length) {
      throw errors[0];
    }

    const errorsText =
      errors.length === providerInstances.length
        ? errors.map((err) => String(err)).join("\n")
        : null;

    if (errors.length > 0) {
      /* store in cache */
      cache.set(cacheKey, {
        data: results,
        expiration: now + CACHE_TTL,
      });
    }

    return c.json({
      error: errorsText,
      data: results,
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return c.json({ error: e.message }, 500);
    }
    return c.status(500);
  }
});

app.get("/api/providers", async (c) => {
  const data = allProviders.map((provider) => {
    /* remove functions to fit ProviderInfo */
    return Object.entries(provider).reduce((acc, [key, value]) => {
      if (typeof value !== "function") {
        acc[key] = value;
      }
      return acc;
    }, {} as ProviderInfo);
  });

  return c.json(data);
});

/* serve entire dist folder as static */
app.use(
  "/*",
  serveStatic({
    root: distFolderPath,
    getContent: async (path) => {
      try {
        const file = Bun.file(path);
        let content = await file.arrayBuffer();

        if (file.name.endsWith("index.html")) {
          const headTag = Bun.env.FRONT_HEAD_TAGS || process.env.FRONT_HEAD_TAGS || "";
          const bodyTag = Bun.env.FRONT_BODY_TAGS || process.env.FRONT_BODY_TAGS || "";

          let htmlContent = await file.text();

          htmlContent = htmlContent
            .replace("</head>", `${headTag}</head>`)
            .replace("<body>", `<body>${bodyTag}`);
          content = Buffer.from(htmlContent).buffer as ArrayBuffer;
        }

        return new Response(content, {
          headers: {
            "Content-Type": file.type,
          },
        });
      } catch (e) {
        return new Response(null, {
          status: 404,
        });
      }
    },
  })
);

if (devMode) {
  console.log("Running in development\n");
  console.log(`Backend is running on http://localhost:${port}.`);
  console.log("Frontend is running on http://localhost:5173.");
} else {
  console.log("Running in production\n");
  console.log(`Running on http://localhost:${port}.`);
}

if (!cmdArgs.includes("--no-browser")) {
  openBrowser(`http://localhost:${port}`);
}

serve({
  fetch: app.fetch,
  port,
});
