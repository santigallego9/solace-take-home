import type { Advocate } from "@custom-types/advocate";
import { AdvocatesTableHeader } from "@advocates/AdvocatesTableHeader";
import { AdvocatesSpecialtiesCell } from "@advocates/AdvocatesSpecialtiesCell";
import { SortConfig, SortKey } from "@custom-types/sort";
import { formatPhoneNumber } from "@libs/utils";

import "@advocates/styles/advocatesTable.css";

export type AdvocatesTablesProps = {
  advocates: Advocate[];
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
};

export const AdvocatesTable = ({
  advocates,
  sortConfig,
  onSort,
}: AdvocatesTablesProps) => {
  const handleSort = (key: SortKey) => {
    onSort(key);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <AdvocatesTableHeader
              columnKey="firstName"
              label="First Name"
              sortable={true}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
            <AdvocatesTableHeader
              columnKey="lastName"
              label="Last Name"
              sortable={true}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
            <AdvocatesTableHeader
              columnKey="city"
              label="City"
              sortable={true}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
            <AdvocatesTableHeader
              columnKey="degree"
              label="Degree"
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
            <AdvocatesTableHeader
              columnKey="specialties"
              label="Specialties"
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
            <AdvocatesTableHeader
              columnKey="yearsOfExperience"
              label="Experience"
              sortable={true}
              handleSort={handleSort}
              sortConfig={sortConfig}
            />
            <AdvocatesTableHeader
              columnKey="phoneNumber"
              label="Phone Number"
            />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {advocates.map((advocate) => (
            <tr key={advocate.id} className="hover:bg-gray-50">
              <td className="table-cell-primary">{advocate.firstName}</td>
              <td className="table-cell">{advocate.lastName}</td>
              <td className="table-cell">{advocate.city}</td>
              <td className="table-cell">{advocate.degree}</td>
              <td className="px-6 py-4">
                <AdvocatesSpecialtiesCell specialties={advocate.specialties} />
              </td>
              <td className="table-cell">{advocate.yearsOfExperience} years</td>
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
