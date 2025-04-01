import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export type AdvocatesSpecialtiesCellProps = {
  specialties: string[];
};

const MAX_CHARS = 75;

export const AdvocatesSpecialtiesCell = ({
  specialties,
}: AdvocatesSpecialtiesCellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPreviewText = () => {
    let preview = "";
    let count = 0;
    let itemsShown = 0;

    // Always show at least the first specialty
    if (specialties.length > 0) {
      preview = specialties[0];
      count = specialties[0].length;
      itemsShown = 1;
    }

    for (let i = 1; i < specialties.length; i++) {
      const specialty = specialties[i];
      const nextCount = count + specialty.length + 2;

      if (nextCount <= MAX_CHARS) {
        preview += ", " + specialty;
        count = nextCount;
        itemsShown++;
      } else {
        break;
      }
    }

    return {
      text: preview,
      remaining: specialties.length - itemsShown,
    };
  };

  const preview = getPreviewText();
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer text-sm text-gray-600 hover:text-blue-600"
      >
        {preview.text}
        {preview.remaining > 0 && (
          <span className="text-blue-600"> +{preview.remaining} more</span>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Specialties</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <ul className="list-disc pl-4 space-y-2">
                {specialties.map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
