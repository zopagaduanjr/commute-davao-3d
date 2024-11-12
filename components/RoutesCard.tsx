import React from "react";
import { Route } from "@/types";

interface RoutesCardProps {
  routes: Route[];
  onCheckboxChange: (route: Route) => void;
}

const RoutesCard: React.FC<RoutesCardProps> = ({
  routes,
  onCheckboxChange,
}) => {
  return (
    <div className="absolute top-4 left-4 bg-white text-black shadow-lg rounded-lg p-4 w-md max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-500">
      <div className="sticky top-0 flex flex-col">
        <h2 className="text-lg font-semibold">Jeepney Routes</h2>
        <p className="text-base text-gray-600">
          Check on the routes you want to view.
        </p>
      </div>
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
  );
};

export default RoutesCard;
