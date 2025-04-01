import { useState, useMemo } from "react";
import type { Advocate } from "@custom-types/advocate";
import { TableHeader } from "@components/advocates/TableHeader";
import { SpecialtiesCell } from "@components/advocates/SpecialtiesCell";
import { formatPhoneNumber } from "@components/advocates/utils";

import "@components/advocates/styles/advocatesTable.css";

type SortDirection = "ascending" | "descending";
type SortKey = keyof Advocate | "";

export type SortConfig = {
  key: SortKey;
  direction: SortDirection;
};

export type AdvocatesTablesProps = {
  advocates: Advocate[];
};

export const AdvocatesTable = ({ advocates }: AdvocatesTablesProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "ascending",
  });

  const requestSort = (key: SortKey) => {
    let newKey: SortKey = key;
    let direction: SortDirection = "ascending";

    if (sortConfig.key !== key || sortConfig.key === "") {
      // If the key is different or empty, set the direction to ascending
      direction = "ascending";
    } else if (sortConfig.direction === "ascending") {
      // If the direction is ascending, set the direction to descending
      direction = "descending";
    } else if (sortConfig.direction === "descending") {
      // If the direction is descending, clear the key
      newKey = "";
    }

    setSortConfig({ key: newKey, direction });
  };

  // TODO(sgallego): Handle sorting on the BE
  const sortedAdvocates = useMemo(() => {
    let sortableAdvocates = [...advocates];

    if (sortConfig.key) {
      sortableAdvocates.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Advocate];
        const bValue = b[sortConfig.key as keyof Advocate];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableAdvocates;
  }, [advocates, sortConfig]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader
              columnKey="firstName"
              label="First Name"
              sortable={true}
              handleSort={requestSort}
              sortConfig={sortConfig}
            />
            <TableHeader
              columnKey="lastName"
              label="Last Name"
              sortable={true}
              handleSort={requestSort}
              sortConfig={sortConfig}
            />
            <TableHeader
              columnKey="city"
              label="City"
              sortable={true}
              handleSort={requestSort}
              sortConfig={sortConfig}
            />
            <TableHeader
              columnKey="degree"
              label="Degree"
              handleSort={requestSort}
              sortConfig={sortConfig}
            />
            <TableHeader
              columnKey="specialties"
              label="Specialties"
              handleSort={requestSort}
              sortConfig={sortConfig}
            />
            <TableHeader
              columnKey="yearsOfExperience"
              label="Years of Experience"
              sortable={true}
              handleSort={requestSort}
              sortConfig={sortConfig}
            />
            <TableHeader
              columnKey="phoneNumber"
              label="Phone Number"
              handleSort={requestSort}
              sortConfig={sortConfig}
            />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedAdvocates.map((advocate) => (
            <tr key={advocate.id} className="hover:bg-gray-50">
              <td className="table-cell-primary">{advocate.firstName}</td>
              <td className="table-cell">{advocate.lastName}</td>
              <td className="table-cell">{advocate.city}</td>
              <td className="table-cell">{advocate.degree}</td>
              <td className="px-6 py-4">
                <SpecialtiesCell specialties={advocate.specialties} />
              </td>
              <td className="table-cell">{advocate.yearsOfExperience}</td>
              <td className="table-cell">
                {formatPhoneNumber(advocate.phoneNumber)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvocatesTable;
