import React, { useEffect, useState } from "react";
import HistoryCard from "../components/HistoryCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BookingHistory = () => {
    const [bookingLists, setBookingList] = useState(null);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                const response = await fetch("/api/bookings/history");
                if (!response.ok) {
                    throw new Error("Failed to fetch booking history");
                }
                const data = await response.json();
                setBookingList(data.bookingList || []);
            } catch (error) {
                console.error("Error fetching booking history:", error);
                setBookingList([]);
            }
        };

        fetchBookingHistory();
    }, []);

    const formatDateThai = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    ประวัติการจองของคุณ
                </h1>
                {bookingLists && bookingLists.length === 0 ? (
                    <p className="text-lg text-gray-500 text-center">
                        ไม่มีประวัติการจอง
                    </p>
                ) : (
                    bookingLists && bookingLists.map((bookingList) => (
                        <div key={bookingList._id} className="mb-10">
                            <p className="text-md text-gray-500 font-semibold mb-4">
                                วันที่จอง: {formatDateThai(bookingList.updatedAt)}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {bookingList.bookings.map((booking) => (
                                    <HistoryCard key={booking._id} booking={booking} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
};

export default BookingHistory;
