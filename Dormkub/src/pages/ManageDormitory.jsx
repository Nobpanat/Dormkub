import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DormitoryList from "../components/DormitoryList";
import { Link } from "react-router-dom";

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

  const handleDelete = async (dormitoryId) => {
    if (window.confirm("Are you sure you want to delete this dormitory?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/dormitories/${dormitoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDormitories(dormitories.filter(d => d._id !== dormitoryId));
        alert("Dormitory deleted successfully");
      } catch (error) {
        console.error("Error deleting dormitory:", error);
        alert("Failed to delete dormitory");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow container mx-auto p-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            จัดการหอพักและลงประกาศหอพัก
          </h2>
          <div className="flex justify-center mb-6">
            <Link to={"/AddDormitory"}>
              <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105">
                เพิ่มหอพัก
              </button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <DormitoryList dormitories={dormitories} onDelete={handleDelete} />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ManageDormitory;