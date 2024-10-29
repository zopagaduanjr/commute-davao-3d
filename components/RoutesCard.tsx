import React, { useState, useEffect } from "react";
import { Route } from "@/types";

interface RoutesCardProps {
  routes: Route[];
  onCheckboxChange: (route: Route) => void;
}

const RoutesCard: React.FC<RoutesCardProps> = ({
  routes,
  onCheckboxChange,
}) => {
  const [routeCheckboxes, setRouteCheckboxes] = useState<Route[]>(routes);

  useEffect(() => {
    setRouteCheckboxes(routes);
  }, [routes]);

  const handleCheckboxChange = (rCheckbox: Route) => {
    const updatedRCheckboxes = routeCheckboxes.map((rcb) =>
      rcb.id === rCheckbox.id ? { ...rcb, checked: !rcb.checked } : rcb
    );
    setRouteCheckboxes(updatedRCheckboxes);
    onCheckboxChange(rCheckbox);
  };

  return (
    <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold">Routes</h2>
      <p className="text-sm text-gray-600">Check the routes you want to see</p>
      {routeCheckboxes.map((rCheckbox) => (
        <div key={rCheckbox.id} className="flex items-center mt-2">
          <input
            type="checkbox"
            id={rCheckbox.id}
            checked={rCheckbox.checked}
            onChange={() => handleCheckboxChange(rCheckbox)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor={rCheckbox.id} className="text-sm text-gray-600">
            {rCheckbox.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RoutesCard;
