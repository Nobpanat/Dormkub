import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DormitoryList from "../components/DormitoryList";

const ManageDormitory = () => {
    const [dormitories, setDormitories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDormitories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "/api/dormitories/dorm/getAllDormitoriesOfUser",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setDormitories(response.data);
            } catch (error) {
                console.error("Error fetching dormitories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDormitories();
    }, []);

    return (
        <>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow container mx-auto p-4">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        จัดการหอพักและลงประกาศหอพัก
                    </h2>
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        </div>
                    ) : (
                        <DormitoryList dormitories={dormitories} />
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ManageDormitory;
