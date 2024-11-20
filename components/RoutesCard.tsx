import React, { useState } from "react";
import { Route } from "@/types";

interface RoutesCardProps {
  routes: Route[];
  onCheckboxChange: (route: Route) => void;
}

const RoutesCard: React.FC<RoutesCardProps> = ({
  routes,
  onCheckboxChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="absolute top-4 left-4 bg-white text-black shadow-lg rounded-lg p-4 w-md max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-500">
      <div className="sticky top-0 flex flex-col">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={handleToggleExpand}
        >
          <h2 className="text-lg font-semibold">Jeepney Routes</h2>
          {isExpanded ? (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 12.707a1 1 0 011.414 0L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {isExpanded && (
        <div>
          <p className="text-base text-gray-600">
            Check on the routes you want to view.
          </p>
          <div className="mt-2 flex flex-col items-start max-h-64 overflow-y-auto">
            {routes.map((rCheckbox) => (
              <div key={rCheckbox.id} className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id={rCheckbox.id}
                  checked={rCheckbox.isChecked}
                  onChange={() => onCheckboxChange(rCheckbox)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor={rCheckbox.id} className="text-lg text-gray-800">
                  {rCheckbox.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesCard;
