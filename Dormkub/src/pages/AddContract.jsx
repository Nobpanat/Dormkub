// AddContract.js
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FacilitiesCheckbox from "../components/FacilitiesCheckbox";
import axios from "axios";
// import navigate
import { useNavigate } from "react-router-dom";

const AddContract = () => {
  const navigate = useNavigate(); // เรียกใช้ useNavigate
  const [contractData, setContractData] = useState({
    startDate: "",
    endDate: "",
    file_contract: "file.pdf", // Default mockup file
    description: "",
    roomImage: [
      "https://github.com/Nobpanat/Dormkub/blob/main/DormkubImg/contractRoom%20(Medium).jpg?raw=true",
    ], // Mockup image
    DormitoryName: "",
    rent: "",
    deposit: "",
    totalPrice: "",
    address: "",
    facilities: [],
    roomType: "",
    size: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContractData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContractData((prevData) => ({
        ...prevData,
        file_contract: file.name,
      }));
    }
  };

  const handleFacilitiesChange = (selectedFacilities) => {
    setContractData((prevData) => ({
      ...prevData,
      facilities: selectedFacilities,
    }));
  };

  const closePopupAndRedirect = () => {
    setShowPopup(false);
    navigate("/ManageContract");
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/contracts", contractData);
      setShowPopup(true); // แสดง popup เมื่อเพิ่มสำเร็จ
    } catch (error) {
      console.error("Error adding contract:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">
            ลงประกาศขายสัญญาหอพัก
          </h1>
          <form className="space-y-6 bg-white p-6 rounded shadow-md max-w-lg mx-auto">
            <div>
              <label className="block font-semibold mb-1">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={contractData.startDate}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date:</label>
              <input
                type="date"
                name="endDate"
                value={contractData.endDate}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Dormitory Name:
              </label>
              <input
                type="text"
                name="DormitoryName"
                value={contractData.DormitoryName}
                onChange={handleChange}
                placeholder="ระบุชื่อหอพัก"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description:</label>
              <textarea
                name="description"
                value={contractData.description}
                onChange={handleChange}
                placeholder="ระบุรายละเอียดหอพัก"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Room Image (Default):
              </label>
              <img
                src={contractData.roomImage[0]}
                alt="Default Room"
                className="w-full h-48 object-cover rounded mb-2"
              />
              <small className="text-gray-500">
                * ภาพนี้เป็นภาพจำลอง ผู้ใช้ไม่ต้องอัปโหลด
              </small>
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Contract File (Default):
              </label>
              <input
                type="file"
                name="file_contract"
                onChange={handleFileChange}
                className="border p-2 w-full rounded"
              />
              <small className="text-gray-500">
                * ไฟล์ปัจจุบัน: {contractData.file_contract} (mockup)
              </small>
            </div>
            <div>
              <label className="block font-semibold mb-1">Rent (฿):</label>
              <input
                type="number"
                name="rent"
                value={contractData.rent}
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
                value={contractData.deposit}
                onChange={handleChange}
                placeholder="ระบุค่ามัดจำ"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Total Price (฿):
              </label>
              <input
                type="number"
                name="totalPrice"
                value={contractData.totalPrice}
                onChange={handleChange}
                placeholder="ระบุราคาทั้งหมด"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Address:</label>
              <input
                type="text"
                name="address"
                value={contractData.address}
                onChange={handleChange}
                placeholder="ระบุที่อยู่"
                className="border p-2 w-full rounded"
              />
            </div>
            <FacilitiesCheckbox
              selectedFacilities={contractData.facilities}
              onFacilitiesChange={handleFacilitiesChange}
            />
            <div>
              <label className="block font-semibold mb-1">Room Type:</label>
              <input
                type="text"
                name="roomType"
                value={contractData.roomType}
                onChange={handleChange}
                placeholder="ระบุประเภทห้อง (เช่น แอร์)"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Size (ตร.ม.):</label>
              <input
                type="number"
                name="size"
                value={contractData.size}
                onChange={handleChange}
                placeholder="ระบุขนาดห้อง"
                className="border p-2 w-full rounded"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full"
              >
                Add Contract
              </button>
            </div>
          </form>
          {/* Popup Notification */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded shadow-lg max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  เพิ่มสัญญาเรียบร้อย!
                </h2>
                <p className="text-gray-600 mb-6">
                  สัญญาหอพักของคุณถูกบันทึกแล้ว
                </p>
                <button
                  onClick={closePopupAndRedirect}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  ตกลง
                </button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AddContract;
