import type { Advocate } from "@custom-types/advocate";
import type { SortConfig } from "@custom-types/sort";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

export type AdvocatesTableHeaderProps = {
  columnKey: keyof Advocate;
  label: string;
  sortable?: boolean;
  handleSort?: (key: keyof Advocate) => void;
  sortConfig?: SortConfig;
};

export const AdvocatesTableHeader = ({
  columnKey,
  label,
  sortable = false,
  handleSort,
  sortConfig,
}: AdvocatesTableHeaderProps) => {
  const renderSortIndicator = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return null;
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
    ) : (
      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
    );
  };

  const handleClick = () => {
    if (sortable) {
      handleSort?.(columnKey);
    }
  };

  return (
    <th
      className={`table-header ${sortable ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {label}
        <span className="mb-0.5 ml-0.5">
          {sortable && renderSortIndicator(columnKey)}
        </span>
      </div>
    </th>
  );
};
