"use client";

import { useState, useEffect, useCallback } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AdvocatesTable } from "@advocates/AdvocatesTable";
import { Pagination } from "@common/Pagination";
import { fetchAdvocates, FetchAdvocatesData } from "@libs/advocates";
import { Advocate } from "@custom-types/advocate";
import { SortConfig, SortKey, SortDirection } from "@custom-types/sort";

const AdvocatesManager = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Table data states
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });

  const getAdvocates = useCallback(async (data: FetchAdvocatesData) => {
    setLoading(true);
    const results = await fetchAdvocates(data);

    if (results) {
      setError(null);
      setAdvocates(results.data);
      setTotalItems(results.total);
      setCurrentPage(results.page);
      setItemsPerPage(results.limit);
    } else {
      setError("Failed to fetch advocates");
    }

    setLoading(false);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      getAdvocates({
        searchQuery,
        page,
        limit: itemsPerPage,
        sortConfig,
      });
    },
    [getAdvocates, searchQuery, itemsPerPage, sortConfig]
  );

  // Initial data fetch when component mounts
  useEffect(() => {
    getAdvocates({
      page: 1,
      limit: itemsPerPage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentPage(1);
      getAdvocates({
        searchQuery,
        page: 1,
        limit: itemsPerPage,
        sortConfig,
      });
    },
    [getAdvocates, searchQuery, itemsPerPage, sortConfig]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
    getAdvocates({
      page: 1,
      limit: itemsPerPage,
      sortConfig,
    });
  }, [getAdvocates, itemsPerPage, sortConfig]);

  const handleSortChange = useCallback(
    (key: SortKey) => {
      let newKey: SortKey = key;
      let direction: SortDirection = "asc";

      if (sortConfig.key !== key || sortConfig.key === "") {
        // If the key is different or empty, set the direction to ascending
        direction = "asc";
      } else if (sortConfig.direction === "asc") {
        // If the direction is ascending, set the direction to descending
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        // If the direction is descending, clear the key
        newKey = "";
      }

      const newSortConfig = { key: newKey, direction };
      setSortConfig(newSortConfig);

      getAdvocates({
        searchQuery,
        page: currentPage,
        limit: itemsPerPage,
        sortConfig: newSortConfig,
      });
    },
    [
      sortConfig.key,
      sortConfig.direction,
      searchQuery,
      currentPage,
      itemsPerPage,
      getAdvocates,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="relative flex-grow flex">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search advocates by name, city, or specialty..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-20 flex items-center pr-4 z-50"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : advocates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No advocates found matching your criteria.</p>
          </div>
        ) : (
          <AdvocatesTable
            advocates={advocates}
            sortConfig={sortConfig}
            onSort={handleSortChange}
          />
        )}
      </div>

      {!loading && !error && advocates.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdvocatesManager;
