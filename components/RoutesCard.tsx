import React, { useState, useEffect, use } from "react";

interface Route {
  id: string;
  label: string;
  checked: boolean;
}

interface RoutesCardProps {
  routes: Route[];
}

const RoutesCard: React.FC<RoutesCardProps> = ({ routes }) => {
  const [checkboxes, setCheckboxes] = useState<Route[]>(routes);

  useEffect(() => {
    setCheckboxes(routes);
  }, [routes]);

  const handleCheckboxChange = (checkbox: Route) => {
    const updatedCheckboxes = checkboxes.map((cb) =>
      cb.id === checkbox.id ? { ...cb, checked: !cb.checked } : cb
    );
    setCheckboxes(updatedCheckboxes);
  };

  return (
    <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-semibold">Routes</h2>
      <p className="text-sm text-gray-600">Check the routes you want to see</p>
      {checkboxes.map((checkbox) => (
        <div key={checkbox.id} className="flex items-center mt-2">
          <input
            type="checkbox"
            id={checkbox.id}
            checked={checkbox.checked}
            onChange={() => handleCheckboxChange(checkbox)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor={checkbox.id} className="text-sm text-gray-600">
            {checkbox.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RoutesCard;
