import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { emojis } from "shared/defs";
import type { ProviderInfo } from "shared/defs";
import type SearchResult from "shared/defs";
import { SearchIcon } from "./icons";

import AdblockNotice from "./components/AdblockNotice";
import Loader from "./components/Loader";
import Result from "./components/Result";

const apiUrl = import.meta.env.DEV ? "http://localhost:5180" : "";
let ranYet = false;

function App() {
  const [query, setQuery] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(null);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(apiUrl + "/api/providers");
        const data = (await response.json()) as ProviderInfo[];
        const sortedData = data.sort((a, b) => a.category.localeCompare(b.category));
        setProviders(sortedData);
        setSelectedProvider(sortedData[0]);
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast.error("Error fetching providers");
      }
    };

    fetchProviders();
  }, []);

  async function handleSearch() {
    if (!selectedProvider || !query) {
      toast.error("Please select a provider and enter a query");
      return;
    }

    ranYet = true;
    setSearchResults([]);
    setLoading(true);

    try {
      const results = await fetchSearchResults();
      setSearchResults(results);
    } catch (error) {
      console.error("Error:", error);
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  }

  async function fetchSearchResults() {
    const url = `${apiUrl}/api/search?provider=${
      selectedProvider!.id
    }&query=${encodeURIComponent(query)}`;
    const resp = await fetch(url);

    const json = await resp.json();
    if (!resp.ok && json.error) {
      throw new Error(json.error);
    } else if (!resp.ok && !json.error) {
      throw new Error("Error fetching search results.");
    }

    return json;
  }

  return (
    <>
      <div className="p-4 flex justify-center">
        <div className="max-w-[1024px] w-full min-h-[calc(100vh-2rem)] bg-base-200 rounded-2xl p-2">
          {/* query */}
          <label className="input input-bordered flex items-center gap-2 mb-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchIcon />
          </label>

          {/* provider */}
          <select
            className="select select-bordered w-full mb-2"
            disabled={providers.length === 0 || loading}
            value={selectedProvider?.id || "default"}
            onChange={(e) => {
              const selectedProvider = providers.find(
                (provider) => provider.id === e.target.value
              );
              setSearchResults([]);
              setSelectedProvider(selectedProvider || null);
              ranYet = false;
            }}
          >
            {providers.length > 0 ? (
              providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {emojis[provider.category]} {provider.name} {provider.notice}
                </option>
              ))
            ) : (
              <option disabled value="default">
                Loading providers...
              </option>
            )}
          </select>

          {/* search button */}
          <button
            className="btn btn-primary w-full"
            onClick={handleSearch}
            disabled={loading || !selectedProvider || !query}
          >
            Search
          </button>

          {/* loading spinner */}
          {loading && <Loader />}

          {/* no results */}
          {!loading && searchResults.length === 0 && ranYet && (
            <div className="flex justify-center mt-32">No results</div>
          )}

          {/* results */}
          {searchResults.map((result) => (
            <Result
              key={result.link}
              result={result}
              providerAction={selectedProvider!.action}
            />
          ))}
        </div>
      </div>
      <AdblockNotice />
    </>
  );
}

export default App;
