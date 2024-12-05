import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast"; // นำเข้า Toast

const UpdateDormitory = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [dormitoryImage, setDormitoryImage] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showToast, setShowToast] = useState(false); // State สำหรับ Toast
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDormitory = async () => {
      try {
        const response = await axios.get(`/api/dormitories/${id}`);
        const dormitory = response.data;
        setName(dormitory.name);
        setDescription(dormitory.description);
        setAddress(dormitory.address);
        setDormitoryImage(dormitory.dormitoryImage);
        setRooms(dormitory.rooms);
      } catch (error) {
        console.error("Error fetching dormitory:", error);
      }
    };

    fetchDormitory();
  }, [id]);

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/dormitories/${id}`,
        { name, description, address, dormitoryImage, rooms },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowToast(true); // แสดง Toast
      setTimeout(() => {
        setShowToast(false); // ซ่อน Toast หลังจาก 3 วินาที
        navigate("/ManageDormitory");
      }, 3000);
    } catch (error) {
      console.error("Error updating dormitory:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          อัปเดตหอพัก
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block font-bold mb-2">ชื่อหอพัก:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">คำอธิบาย:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">ที่อยู่:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">รูปหอพัก:</label>
            <input
              type="text"
              value={dormitoryImage.join(", ")}
              onChange={(e) => setDormitoryImage(e.target.value.split(", "))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">จำนวนห้อง:</label>
            {rooms.map((room, index) => (
              <div key={room._id} className="mb-2">
                <label className="block font-bold mb-1">{room.roomtype}</label>
                <input
                  type="number"
                  value={room.amount}
                  onChange={(e) => handleRoomChange(index, "amount", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            อัปเดตหอพัก
          </button>
        </form>
      </div>
      <Footer />
      {showToast && <Toast message="อัปเดตหอพักสำเร็จ!" onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default UpdateDormitory;