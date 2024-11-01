import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingCard from '../components/BookingCard';

const PaymentPage = () => {
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayAll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/bookings/payment/payAll", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("All bookings have been paid!");
      navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
    } catch (err) {
      console.error("Error paying all bookings:", err);
      alert("Failed to pay all bookings.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">ชำระเงิน</h1>
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} compact />
          ))}

          <div className="flex justify-between mt-4 font-semibold">
            <span>ราคารวมทั้งหมด</span>
            <span>{totalPrice} บาท</span>
          </div>

          <div className="flex flex-col items-center mt-6">
            <img
              src="https://www.theodoostore.com/web/image/app/10392/app_icon"
              alt="QR Code for Payment"
              className="w-32 h-32 mb-4"
            />
            <button
              onClick={handlePayAll}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ชำระเงิน
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
