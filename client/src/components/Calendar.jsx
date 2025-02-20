import { useState } from "react";
import PropTypes from "prop-types";

const Calendar = ({ onSelectDate }) => {
  const [date, setDate] = useState("");
  const [isValid, setIsValid] = useState(null);

  const handleValidation = () => {
    if (date) {
      setIsValid(true);
      onSelectDate(date);
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={`border p-2 rounded text-black ${
          isValid === false
            ? "border-red-500"
            : isValid
            ? "border-green-500"
            : ""
        }`}
      />
      <button
        onClick={handleValidation}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Valider
      </button>
      {isValid === false && (
        <p className="text-red-500 text-sm items-center">
          Veuillez sélectionner une date.
        </p>
      )}
      {isValid === true && (
        <div className="flex justify-center items-center">
          <p className="text-green-500 text-sm ">Date validée !</p>
        </div>
      )}
    </div>
  );
};

Calendar.propTypes = {
  onSelectDate: PropTypes.func.isRequired,
};

export default Calendar;
