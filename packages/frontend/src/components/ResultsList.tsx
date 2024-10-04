import type BaseResult from "shared/defs";
import Result from "./Result";
import { Action } from "shared/defs";

interface ResultsListProps {
  searchResults: BaseResult[];
  providerAction: Action;
}

const ResultsList: React.FC<ResultsListProps> = ({ searchResults, providerAction }) => (
  <div>
    {searchResults.map((result) => (
      <Result key={result.link} result={result} providerAction={providerAction} />
    ))}
  </div>
);

export default ResultsList;
