import { useState } from "react";
import { formatLastUpdated } from "../utils/dateUtils";

export const useLastUpdated = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateTimestamp = () => {
    setLastUpdated(new Date());
  };

  const getLastUpdatedText = () => formatLastUpdated(lastUpdated);

  return {
    lastUpdated,
    updateTimestamp,
    getLastUpdatedText,
  };
};
