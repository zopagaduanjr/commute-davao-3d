import React, { useState } from "react";
import { Route } from "@/types";

interface CardProps {
  routes: Route[];
  onButtonClick: (route: Route) => void;
}

const RouteInfoCard: React.FC<CardProps> = ({ routes, onButtonClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const checkedRoutes = routes.filter((route) => route.checked);
  const totalPages = checkedRoutes.length;
  const currentRoutes = checkedRoutes.slice(currentPage, currentPage + 1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div>
      {currentRoutes.map((route) => (
        <div
          className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-4"
          key={route.id}
        >
          <h2 className="text-lg font-semibold">{route.label}</h2>
          <p className="text-sm text-gray-600">{route.id}</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onButtonClick(route)}
          >
            Follow Route
          </button>
        </div>
      ))}
      {checkedRoutes.length > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RouteInfoCard;
