import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DormItem({ imgSrc, dormName, address, price, specialText }) {
  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4 mb-6 bg-white flex flex-col lg:flex-row">
      {/* Image Section */}
      <img
        src={imgSrc}
        alt="ห้องพัก"
        className="mb-4 lg:mb-0 lg:mr-4 w-full lg:w-1/3 h-48 object-cover rounded-lg"
      />

      {/* Text Section */}
      <div className="flex flex-col justify-center">
        {specialText && (
          <p className="text-sm text-blue-900 font-semibold mb-2">
            {specialText}
          </p>
        )}
        <p className="text-lg font-bold">{dormName}</p>
        <p className="text-gray-600">{address}</p>
        <p className="text-gray-800 font-medium">{price}บาท ต่อเดือน</p>
      </div>
    </div>
  );
}

const Sidebar = () => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold mb-4">กรองการค้นหา</h3>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">ราคาต่อเดือน</label>
        <div className="flex space-x-2">
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="เริ่มต้น"
          />
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="สูงสุด"
          />
        </div>
      </div>
      <div className="mb-4">
        <p className="text-gray-700">ประเภทที่ต้องการหาหอพัก</p>
        <label className="block">
          <input type="checkbox" /> ทั้งหมด
        </label>
        <label className="block">
          <input type="checkbox" /> หอพักจากเจ้าของหอพัก
        </label>
        <label className="block">
          <input type="checkbox" /> ขายสัญญาหอพัก
        </label>
      </div>
      <div className="mb-4">
        <p className="text-gray-700">สิ่งอำนวยความสะดวกในห้องพัก</p>
        <label className="block">
          <input type="checkbox" /> แอร์
        </label>
        <label className="block">
          <input type="checkbox" /> พัดลม
        </label>
        <label className="block">
          <input type="checkbox" /> ทีวี
        </label>
        <label className="block">
          <input type="checkbox" /> ตู้เย็น
        </label>
      </div>
    </div>
  );
};

const Suggest = () => {
  const [suggestRooms, setSuggestRooms] = useState([]);

  useEffect(() => {
    const fetchSuggestRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/rooms/getAll/SuggestRooms"
        );
        setSuggestRooms(response.data);
        // console.log("Suggest rooms:", response.data);
      } catch (error) {
        console.error("Error fetching suggest rooms:", error);
      }
    };

    fetchSuggestRooms();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <button className="bg-[#03045E] text-white px-4 py-2 rounded-lg mb-4">
        หอพักแนะนำ
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dorm Items */}
        <div className="lg:col-span-2">
          {suggestRooms.map((room) => (
            <Link to={`/room/${room._id}`} key={room._id}>
              <DormItem
                key={room._id}
                imgSrc={room.roomImage[0] || "https://placehold.co/300x200"} // Default image if none
                dormName={room.id_dormitory.name}
                address={room.id_dormitory.address}
                price={room.rent}
                specialText={
                  room.roomStatus === "active" ? "ขายสัญญาหอพัก" : ""
                }
              />
            </Link>
          ))}
        </div>

        {/* Right Column: Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};

export default Suggest;
