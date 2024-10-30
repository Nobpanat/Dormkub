import axios from 'axios';

const ActionButtons = ({ roomId }) => {

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token'); // รับ token จาก localStorage
      const response = await axios.post('/api/bookings', { roomId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('จองห้องสำเร็จ');
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('ไม่สามารถจองห้องได้');
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
