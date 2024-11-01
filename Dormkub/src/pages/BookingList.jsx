import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingItem from "../components/BookingItem";
import axios from "axios";

// Confirmation Modal Component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
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

// Notification Modal Component
const NotificationModal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
      <p className="text-lg mb-4">{message}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        ตกลง
      </button>
    </div>
  </div>
);

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingListId, setBookingListId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalPrice(response.data.totalPrice);
        setBookings(response.data.bookings);
        setBookingListId(response.data.bookingListId);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowConfirmModal(true); // Show confirmation modal before deleting
  };

  const confirmDeleteBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`/api/bookings/${selectedBookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificationMessage(response.data.message); // Set success message
      setShowNotificationModal(true); // Show notification modal

      // Update bookings list and total price
      const updatedBookings = bookings.filter(
        (booking) => booking._id !== selectedBookingId
      );
      setBookings(updatedBookings);
      const updatedTotalPrice = updatedBookings.reduce(
        (total, booking) => total + booking.total_price,
        0
      );
      setTotalPrice(updatedTotalPrice);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setNotificationMessage("ไม่สามารถลบการจองได้"); // Show error message
      setShowNotificationModal(true); // Show notification modal
    } finally {
      setShowConfirmModal(false); // Close confirmation modal
      setSelectedBookingId(null);
    }
  };

  const handlePayAll = () => {
    if (bookingListId) {
      navigate(`/payment/${bookingListId}`, { state: { totalPrice } });
    } else {
      setNotificationMessage("ไม่พบรายการการจองสำหรับชำระเงิน");
      setShowNotificationModal(true);
    }
  };

  if (loading) {
    return <p className="text-center text-lg font-semibold">กำลังโหลด...</p>;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">
            รายการการจองของคุณ
          </h1>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">ไม่พบการจอง</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingItem
                  key={booking._id}
                  booking={booking}
                  onDelete={() => handleDeleteBooking(booking._id)}
                  isRoom={!!booking.id_room}
                  isContract={!!booking.id_contract}
                />
              ))}
            </div>
          )}
          {bookings.length > 0 && (
            <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-white to-gray-100 p-6 shadow-lg flex justify-center backdrop-blur-sm">
              <button
                onClick={handlePayAll}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105"
              >
                ชำระเงินทั้งหมด: ฿{totalPrice.toFixed(2)}
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          message="คุณแน่ใจว่าต้องการลบการจองนี้?"
          onConfirm={confirmDeleteBooking}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <NotificationModal
          message={notificationMessage}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </>
  );
};

export default BookingList;
