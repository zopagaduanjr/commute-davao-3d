import React, { useState, useEffect } from "react";
import { Landmark, Route } from "@/types";
import Dropdown from "@/components/Dropdown";

interface CardProps {
  routes: Route[];
  onFollowButtonClick: (route: Route) => void;
  onLandmarkButtonClick: (landmark: Landmark) => void;
}

const RouteInfoCard: React.FC<CardProps> = ({
  routes,
  onFollowButtonClick,
  onLandmarkButtonClick,
}) => {
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
    <div className="text-white p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{selectedOption.label}</h2>
          <h3 className="text-sm font-semibold">Route Information</h3>
        </div>
        {currentRoutes.length > 1 && (
          <Dropdown
            label={selectedOption.label || ""}
            options={currentRoutes}
            onSelect={handleSelect}
          />
        )}
      </div>
      <div className="mt-2 flex flex-col items-start">
        {selectedOption.landmarks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Landmarks</h3>
            {selectedOption.landmarks.map((landmark) => (
              <div
                key={landmark.label}
                className="text-lg cursor-pointer text-gray-300 hover:underline"
                onClick={() => onLandmarkButtonClick(landmark)}
              >
                {landmark.label}
              </div>
            ))}
          </div>
        )}
        <p className="text-sm my-4">{selectedOption.info}</p>
      </div>
      <div className="w-full">
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onFollowButtonClick(selectedOption)}
        >
          {selectedOption.isFollowed ? "Stop Following Route" : "Follow Route"}
        </button>
      </div>
    </div>
  );
};

export default RouteInfoCard;
