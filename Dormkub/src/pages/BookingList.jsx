import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingItem from "../components/BookingItem";
import axios from "axios";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // ดึงข้อมูลการจองจาก API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data.bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleSelectBooking = (id) => {
    if (selectedBookings.includes(id)) {
      setSelectedBookings(
        selectedBookings.filter((bookingId) => bookingId !== id)
      );
    } else {
      setSelectedBookings([...selectedBookings, id]);
    }
  };

  // ฟังก์ชันลบการจอง
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
        // อัปเดตรายการการจองหลังลบสำเร็จ
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("ไม่สามารถลบการจองได้");
      }
    }
  };

  const handlePay = (booking) => {
    // ฟังก์ชันสำหรับจ่ายเงิน
    console.log("กำลังจ่ายสำหรับการจอง:", booking);
  };

  if (loading) {
    return <p className="text-center text-lg font-semibold">กำลังโหลด...</p>;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto p-4">
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
                  onSelect={handleSelectBooking}
                  onPay={handlePay}
                  onDelete={handleDeleteBooking} // ส่งฟังก์ชันลบ
                  isSelected={selectedBookings.includes(booking._id)}
                />
              ))}
            </div>
          )}
          {selectedBookings.length > 0 && (
            <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg flex justify-center">
              <button
                onClick={() =>
                  console.log("Selected bookings:", selectedBookings)
                }
                className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600"
              >
                ชำระเงินสำหรับการจองที่เลือก
              </button>
            </div>
          )}
        </div>
        <div className="mt-auto">

        <Footer/>
        </div>
      </div>
    </>
  );
};

export default BookingList;
