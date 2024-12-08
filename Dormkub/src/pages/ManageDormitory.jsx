import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DormitoryList from "../components/DormitoryList";
import ConfirmDelete from "../components/ConfirmDelete";
import { Link } from "react-router-dom";

const ManageDormitory = () => {
  const [dormitories, setDormitories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/dormitories/${selectedItem}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDormitories(dormitories.filter((d) => d._id !== selectedItem));
      // alert("Dormitory deleted successfully");
    } catch (error) {
      console.error("Error deleting dormitory:", error);
      // alert("Failed to delete dormitory");
    }finally {
      setShowConfirmModal(false); // Close confirmation modal
      setSelectedItem(null);
    }
  };

  const handleDeleteItem = async (itemId) => {
    setSelectedItem(itemId);
    setShowConfirmModal(true); // Show confirmation modal before deleting
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
            <DormitoryList
              dormitories={dormitories}
              onDelete={handleDeleteItem}
            />
          )}
        </div>
        <Footer />
      </div>
      {showConfirmModal && (
        <ConfirmDelete
          message="คุณแน่ใจว่าต้องการลบหอพักนี้?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default ManageDormitory;
