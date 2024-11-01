import { useState } from 'react';
import axios from 'axios';

// Modal Component
const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">{message}</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};

const ActionButtons = ({ roomId, contractId }) => {
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const bookingData = roomId ? { roomId } : { contractId };
      const response = await axios.post('/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalMessage(roomId ? 'จองห้องสำเร็จ' : 'จองสัญญาสำเร็จ');
    } catch (err) {
      console.error('Error creating booking:', err);
      setModalMessage(roomId ? 'ไม่สามารถจองห้องได้' : 'ไม่สามารถจองสัญญาได้');
    } finally {
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="flex justify-end space-x-4 mt-4">
      <button className="bg-gray-300 px-4 py-2 rounded">ติดต่อ</button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleBooking}
      >
        จอง
      </button>
      
      {showModal && (
        <Modal message={modalMessage} onClose={closeModal} />
      )}
    </div>
  );
};

export default ActionButtons;
