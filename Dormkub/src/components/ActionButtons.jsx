import axios from 'axios';

const ActionButtons = ({ roomId, contractId }) => {

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const bookingData = roomId ? { roomId } : { contractId }; // Send roomId or contractId based on availability
      const response = await axios.post('/api/bookings', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert(roomId ? 'จองห้องสำเร็จ' : 'จองสัญญาสำเร็จ');
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(roomId ? 'ไม่สามารถจองห้องได้' : 'ไม่สามารถจองสัญญาได้');
    }
  };

  return (
    <div className="flex justify-end space-x-4 mt-4">
      <button className="bg-gray-300 px-4 py-2 rounded">ติดต่อ</button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleBooking}
      >
        จอง
      </button>
    </div>
  );
};

export default ActionButtons;

