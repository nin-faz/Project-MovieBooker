const ReservationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold">Réservation confirmée!</h2>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ReservationModal;
