import { SortConfig } from "@custom-types/sort";
import { SearchResponse } from "@custom-types/search";

export type FetchAdvocatesData = {
  searchQuery?: string;
  page?: number;
  limit?: number;
  sortConfig?: SortConfig;
};

export const fetchAdvocates = async (
  data: FetchAdvocatesData
): Promise<SearchResponse | undefined> => {
  try {
    const { searchQuery, page, limit, sortConfig } = data;

    let response;
    if (!!searchQuery || !!sortConfig?.key) {
      response = await fetch("/api/advocates/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: searchQuery,
          page,
          limit,
          sortConfig,
        }),
      });
    } else {
      response = await fetch(`/api/advocates?page=${page}&limit=${limit}`);
    }

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const results: SearchResponse = await response.json();
    return results;
  } catch (err) {
    console.error("Error fetching advocates:", err);
    return undefined;
  }
};
