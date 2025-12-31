export const CSGOROLL_GRAPHQL_URL = "https://router.csgoroll.com/graphql";

// Persisted Query Hash for WithdrawTradeList
const QUERY_HASH =
  "3b2f3093415f02ea554035c1d0f102ce588fe31060cbac268b21d139bdb9c25e";

export const fetchItems = async (
  min: number,
  max: number,
  cursor: string | null = null,
) => {
  const variables = {
    first: 50,
    orderBy: "TOTAL_VALUE_DESC",
    status: "LISTED",
    minTotalValue: min,
    maxTotalValue: max,
    steamAppName: "CSGO",
    t: Date.now(),
    ...(cursor && { after: cursor }),
  };

  const extensions = {
    persistedQuery: {
      version: 1,
      sha256Hash: QUERY_HASH,
    },
  };

  const url = new URL(CSGOROLL_GRAPHQL_URL);
  url.searchParams.append("operationName", "WithdrawTradeList");
  url.searchParams.append("variables", JSON.stringify(variables));
  url.searchParams.append("extensions", JSON.stringify(extensions));

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "apollographql-client-id": "www-csgoroll-0",
        "apollographql-client-name": "www-csgoroll",
        "apollographql-client-version": "v362",
        "x-apollo-operation-name": "WithdrawTradeList",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
