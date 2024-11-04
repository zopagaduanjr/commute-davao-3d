import React from "react";
import { Route } from "@/types";

interface CardProps {
  routes: Route[];
  onButtonClick: (route: Route) => void;
}

const RouteInfoCard: React.FC<CardProps> = ({ routes, onButtonClick }) => {
  const currentRoutes = routes.filter((route) => route.isChecked);

  return (
    <div>
      {currentRoutes.map((route) => (
        <div
          className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4"
          key={route.id}
        >
          <h2 className="text-lg font-semibold">{route.label}</h2>
          <p className="text-sm text-gray-600">{route.id}</p>
          <div className="mt-2 flex items-center">
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => onButtonClick(route)}
            >
              {route.isCameraFollowed ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteInfoCard;
