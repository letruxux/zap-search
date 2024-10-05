import Result from "./Result";
import { FinalResult, ProviderInfo } from "shared/defs";

interface ResultsListProps {
  searchResults: FinalResult[];
  providers: ProviderInfo[];
}

const ResultsList: React.FC<ResultsListProps> = ({ searchResults, providers }) => (
  <div>
    {searchResults.map((result) => (
      <Result key={result.link} result={result} providers={providers} />
    ))}
  </div>
);

export default ResultsList;
