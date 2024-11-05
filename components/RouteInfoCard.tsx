import React, { useState, useEffect } from "react";
import { Route } from "@/types";
import Dropdown from "@/components/Dropdown";

interface CardProps {
  routes: Route[];
  onButtonClick: (route: Route) => void;
}

const RouteInfoCard: React.FC<CardProps> = ({ routes, onButtonClick }) => {
  const currentRoutes = routes.filter((route) => route.isChecked);
  const [selectedOption, setSelectedOption] = useState<Route>(currentRoutes[0]);

  useEffect(() => {
    const checkedRoutes = routes.filter((route) => route.isChecked);
    if (checkedRoutes.length > 0) {
      setSelectedOption(
        checkedRoutes.find((r) => r.id === selectedOption.id) ||
          checkedRoutes[0]
      );
    }
  }, [routes]);

  const handleSelect = (option: Route) => {
    setSelectedOption(option);
  };

  return (
    <div className="absolute top-4 right-4 bg-gray-800 text-white p-4 shadow-lg rounded-lg max-w-md ">
      <div className="sticky top-0">
        <h2 className="text-lg font-semibold">Route Information</h2>
        <Dropdown
          label={selectedOption.label || ""}
          options={currentRoutes}
          onSelect={handleSelect}
        />
      </div>
      <div className="mt-2 flex flex-col items-start max-h-64 overflow-y-auto">
        <p className="text-sm mb-2">{selectedOption.info}</p>
      </div>
      <div className="sticky bottom-0 w-full">
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onButtonClick(selectedOption)}
        >
          {selectedOption.isFollowed ? "Stop Following Route" : "Follow Route"}
        </button>
      </div>
    </div>
  );
};

export default RouteInfoCard;
