import { useEffect, useState } from "react";
import Result from "./Result";
import { FinalResult, ProviderInfo } from "shared/defs";

interface ResultsListProps {
  searchResults: FinalResult[];
  providers: ProviderInfo[];
}

const ResultsList: React.FC<ResultsListProps> = ({ searchResults, providers }) => {
  const [showOtherResults, setShowOtherResults] = useState(false);
  const suggestedResults = searchResults.filter((e) => e.points >= 1);
  const otherResults = searchResults.filter((e) => e.points < 1);

  useEffect(() => {
    setShowOtherResults(false);
  }, [searchResults]);

  return (
    <div>
      {suggestedResults.map((result) => (
        <Result key={result.link} result={result} providers={providers} />
      ))}
      {otherResults.length > 0 && (
        <>
          {!showOtherResults && (
            <button
              className="btn w-full btn-link text-base-content ml-2 mt-2"
              onClick={() => setShowOtherResults(true)}
            >
              Show other results
            </button>
          )}
          {showOtherResults &&
            otherResults.map((result) => (
              <Result
                key={result.link}
                result={result}
                providers={providers}
                highlight={false}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default ResultsList;
