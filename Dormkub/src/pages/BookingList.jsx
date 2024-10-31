import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingItem from "../components/BookingItem";
import axios from "axios";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingListId, setBookingListId] = useState("");
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
    if (window.confirm("คุณแน่ใจว่าต้องการลบการจองนี้?")) {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`/api/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);

            // ลบการจองออกจากรายการ
            const updatedBookings = bookings.filter((booking) => booking._id !== bookingId);
            setBookings(updatedBookings);

            // อัปเดตยอดรวมราคาใหม่
            const updatedTotalPrice = updatedBookings.reduce((total, booking) => total + booking.total_price, 0);
            setTotalPrice(updatedTotalPrice);

        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("ไม่สามารถลบการจองได้");
        }
    }
};


  const handlePayAll = () => {
    if (bookingListId) {
      navigate(`/checkout/${bookingListId}`, { state: { totalPrice } });
    } else {
      alert("ไม่พบรายการการจองสำหรับชำระเงิน");
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
          <h1 className="text-3xl font-bold mb-6 text-center">รายการการจองของคุณ</h1>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">ไม่พบการจอง</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingItem
                  key={booking._id}
                  booking={booking}
                  onDelete={handleDeleteBooking}
                  isRoom={!!booking.id_room}
                  isContract={!!booking.id_contract}
                />
              ))}
            </div>
          )}
          {/* Payment Button */}
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
    </>
  );
};

export default BookingList;
