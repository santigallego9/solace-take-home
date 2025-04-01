import type { Advocate } from "@custom-types/advocate";
import type { SortConfig } from "@components/advocates/AdvocatesTable";

export type TableHeaderProps = {
  columnKey: keyof Advocate;
  label: string;
  sortable?: boolean;
  handleSort?: (key: keyof Advocate) => void;
  sortConfig: SortConfig;
};

export const TableHeader = ({
  columnKey,
  label,
  sortable = false,
  handleSort,
  sortConfig,
}: TableHeaderProps) => {
  const getSortDirectionIndicator = (key: keyof Advocate) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
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
      {label} {sortable && getSortDirectionIndicator(columnKey)}
    </th>
  );
};
