export interface WithdrawAPIParams {
    minPrice: number;
    maxPrice: number;
    after?: string;
    signal?: AbortSignal;
}

export const fetchWithdrawItems = async ({ minPrice, maxPrice, after, signal }: WithdrawAPIParams) => {
    const query = `
    query Withdraw($minPrice: Float, $maxPrice: Float, $after: String) {
        withdraw(input: { minPrice: $minPrice, maxPrice: $maxPrice, after: $after, first: 20, sort: { field: "createdAt", order: "DESC" } }) {
            edges {
                node {
                    id
                    marketName
                    markup
                    price {
                        amount
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
    `;

    // Ensure strict number types for GraphQL Float
    const variables = {
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        after,
    };

    const response = await fetch('https://api.csgoroll.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        signal, // Pass strict AbortSignal
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('RATE_LIMIT_HIT');
        }
        throw new Error(`API_ERROR: ${response.status}`);
    }

    const json = await response.json();
    return json.data.withdraw;
};
