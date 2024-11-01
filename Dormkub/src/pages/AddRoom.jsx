import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


// Custom Popup Component
const CustomPopup = ({ message, onClose }) => (
  <div className="popup-overlay fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
    <div className="popup-content bg-white p-6 rounded shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">Notification</h2>
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Close
      </button>
    </div>
  </div>
);

const AddRoom = () => {
  const { dormitoryId } = useParams();
  const [roomData, setRoomData] = useState({
    roomtype: "",
    size: "",
    rent: "",
    deposit: "",
    totalPrice: "",
    roomImage: [
      "https://github.com/Nobpanat/Dormkub/blob/main/DormkubImg/dormitoryRoom%20(Medium).jpg?raw=true",
      "https://github.com/Nobpanat/Dormkub/blob/main/DormkubImg/imgDormTong.jpg?raw=true",
    ],
    facilities: [],
    amount: "",
  });
  const [facilitiesList] = useState([
    { id: "670fd4248ecf68f7d91328a4", name: "แอร์" },
    { id: "670fd4248ecf68f7d91328a7", name: "พัดลม" },
    { id: "670fd4248ecf68f7d91328aa", name: "เครื่องซักผ้า" },
    { id: "670fd4248ecf68f7d91328ad", name: "เครื่องทำน้ำอุ่น" },
    { id: "670fd4258ecf68f7d91328b0", name: "ตู้เย็น" },
    { id: "670fd4258ecf68f7d91328b3", name: "เตียง" },
    { id: "670fd4258ecf68f7d91328b6", name: "โต๊ะ" },
    { id: "670fd4258ecf68f7d91328b9", name: "ทีวี" },
    { id: "670fd4258ecf68f7d91328bc", name: "Wifi" },
]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (facilityId) => {
    setRoomData((prevData) => ({
      ...prevData,
      facilities: prevData.facilities.includes(facilityId)
        ? prevData.facilities.filter((id) => id !== facilityId)
        : [...prevData.facilities, facilityId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // สมมุติว่า token เก็บไว้ใน localStorage
  
      await axios.post(
        `/api/rooms/${dormitoryId}`,
        {
          ...roomData,
          id_dormitory: dormitoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setShowPopup(true);
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };
  

  const closePopup = () => {
    setShowPopup(false);
    navigate("/manageDormitory");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow container mx-auto p-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            เพิ่มห้องพัก
          </h2>

          <form className="space-y-6 bg-white p-6 rounded shadow-md max-w-lg mx-auto">
            <div>
              <label className="block font-semibold mb-1">Room Type:</label>
              <input
                type="text"
                name="roomtype"
                value={roomData.roomtype}
                onChange={handleChange}
                placeholder="ระบุประเภทห้อง"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Size (m²):</label>
              <input
                type="number"
                name="size"
                value={roomData.size}
                onChange={handleChange}
                placeholder="ระบุขนาดห้อง"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Rent (฿):</label>
              <input
                type="number"
                name="rent"
                value={roomData.rent}
                onChange={handleChange}
                placeholder="ระบุค่าเช่า"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Deposit (฿):</label>
              <input
                type="number"
                name="deposit"
                value={roomData.deposit}
                onChange={handleChange}
                placeholder="ระบุค่ามัดจำ"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Total Price (฿):</label>
              <input
                type="number"
                name="totalPrice"
                value={roomData.totalPrice}
                onChange={handleChange}
                placeholder="ระบุราคาทั้งหมด"
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Room Images:</label>
              <div className="grid grid-cols-2 gap-4">
                {roomData.roomImage.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Room ${index + 1}`}
                    className="rounded border w-full"
                  />
                ))}
              </div>
              <small className="text-gray-500">* ภาพห้องเป็นค่าเริ่มต้น</small>
            </div>

            <div>
              <label className="block font-semibold mb-1">Facilities:</label>
              <div className="flex flex-wrap">
                {facilitiesList.map((facility) => (
                  <label key={facility.id} className="mr-4 mb-2 flex items-center">
                    <input
                      type="checkbox"
                      value={facility.id}
                      checked={roomData.facilities.includes(facility.id)}
                      onChange={() => handleCheckboxChange(facility.id)}
                      className="mr-1"
                    />
                    {facility.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Amount of Rooms:</label>
              <input
                type="number"
                name="amount"
                value={roomData.amount}
                onChange={handleChange}
                placeholder="ระบุจำนวนห้อง"
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>

        <Footer />
      </div>

      {/* Popup for success message */}
      {showPopup && (
        <CustomPopup
          message="เพิ่มห้องพักเรียบร้อยแล้ว!"
          onClose={closePopup}
        />
      )}
    </>
  );
};

export default AddRoom;
