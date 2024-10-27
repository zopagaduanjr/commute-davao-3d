import React from "react";

interface CardProps {
  buttonClick: () => void;
}

const Card: React.FC<CardProps> = ({ buttonClick }) => {
  return (
    <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold">Obrero Route</h2>
      <p className="text-sm text-gray-600">Lorem ipsum dolor semet</p>
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={buttonClick}
      >
        Click Me
      </button>
    </div>
  );
};

export default Card;
