const ConfirmDelete = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            ยืนยัน
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onCancel}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );

export default ConfirmDelete;
