import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

const DormitoryForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง

  // URL ของรูปที่คงที่
  const dormitoryImage = [
    "https://github.com/Nobpanat/Dormkub/blob/main/DormkubImg/imgDormTong.jpg?raw=true"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/dormitories", {
        name,
        description,
        address,
        dormitoryImage
      });
      setPopupMessage("เพิ่มหอพักสำเร็จ!");
      setShowPopup(true);
      console.log(response.data);
      setTimeout(() => {
        navigate(`/add-room/${response.data.dormitory._id}`); // นำทางไปยังหน้าการเพิ่มห้อง
      }, 2000); // รอ 2 วินาทีเพื่อแสดง popup
    } catch (error) {
      console.error("Error adding dormitory:", error);
      setPopupMessage("ไม่สามารถเพิ่มหอพักได้");
      setShowPopup(true);
    }
  };

  return (
    <>
      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
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
          <label className="block font-bold mb-2">รูปหอพัก (mockup):</label>
          <p className="text-sm text-gray-500 mb-2">
            รูปนี้เป็นลิงก์ที่กำหนดไว้ล่วงหน้า และจะส่งไปยังระบบ
          </p>
          <img src={dormitoryImage[0]} alt="Dormitory" className="w-full h-48 object-cover rounded" />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          เพิ่มหอพัก
        </button>
      </form>
    </>
  );
};

export default DormitoryForm;