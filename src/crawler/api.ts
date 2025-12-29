export const CSGOROLL_GRAPHQL_URL = 'https://www.csgoroll.com/en/api/graphql';

const LIST_TRADES_QUERY = `
  query TradeList($first: Int, $orderBy: TradeNodeOrder, $minPrice: Float, $maxPrice: Float, $status: TradeStatus) {
    trades(first: $first, orderBy: $orderBy, minPrice: $minPrice, maxPrice: $maxPrice, status: $status) {
      edges {
        node {
          id
          price
          status
          markup
          assets {
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Note: Verify the actual query structure. This is a best-guess/placeholder based on typical GQL.
// CSGORoll might strictly protect this endpoint.

export const fetchItems = async (min: number, max: number, cursor: string | null = null) => {
    const variables = {
        first: 50,
        orderBy: {
            field: 'ID', // Ensure this matches actual API expectations
            direction: 'DESC'
        },
        minPrice: min,
        maxPrice: max,
        status: 'ACTIVE', // Assuming we only want active trades
        ...(cursor && { after: cursor }) // Handle cursor if needed by API
    };

    try {
        const response = await fetch(CSGOROLL_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: LIST_TRADES_QUERY,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
