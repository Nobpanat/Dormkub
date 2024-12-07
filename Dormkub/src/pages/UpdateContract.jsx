import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import FacilitiesCheckbox from "../components/FacilitiesCheckbox";

const UpdateContract = () => {
  const { id } = useParams();
  const [contract, setContract] = useState({});
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const [selectedFacilities, setSelectedFacilities] = useState([]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(`/api/contracts/${id}`);
        const fetchedContract = response.data;

        // Extract facilities from the contract
        const facilities = fetchedContract.id_facilityList.facilities.map(facility => facility._id);
        setContract({ ...fetchedContract, facilities });
        // setSelectedFacilities(facilities); // อัปเดต facilities ที่เคยมี
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };

    fetchContract();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContract((prevContract) => ({
      ...prevContract,
      [name]: value,
    }));
  };

  const handleFacilitiesChange = (selectedFacilities) => {
    setContract((prevContract) => ({
      ...prevContract,
      facilities: selectedFacilities,
    }));
    setSelectedFacilities(selectedFacilities);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("contract " , contract);
      await axios.put(
        `/api/contracts/${id}`,
        contract,
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/manageContract");
      }, 3000);
    } catch (error) {
      console.error("Error updating contract:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          อัปเดตสัญญา
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="block font-bold mb-2">ชื่อหอพัก:</label>
            <input
              type="text"
              name="DormitoryName"
              value={contract.DormitoryName || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">คำอธิบาย:</label>
            <textarea
              name="description"
              value={contract.description || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">ที่อยู่:</label>
            <input
              type="text"
              name="address"
              value={contract.address || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {/* <div>
            <label className="block font-bold mb-2">รูปห้อง:</label>
            <input
              type="text"
              name="roomImage"
              value={contract.roomImage ? contract.roomImage.join(", ") : ""}
              onChange={(e) => handleChange({ target: { name: "roomImage", value: e.target.value.split(", ") } })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div> */}
          <div>
            <label className="block font-bold mb-2">ค่าเช่า:</label>
            <input
              type="number"
              name="rent"
              value={contract.rent || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">เงินมัดจำ:</label>
            <input
              type="number"
              name="deposit"
              value={contract.deposit || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">ราคารวม:</label>
            <input
              type="number"
              name="totalPrice"
              value={contract.totalPrice || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">ประเภทห้อง:</label>
            <input
              type="text"
              name="roomType"
              value={contract.roomType || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">ขนาดห้อง:</label>
            <input
              type="number"
              name="size"
              value={contract.size || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <FacilitiesCheckbox
            selectedFacilities={contract.facilities || []}
            onFacilitiesChange={handleFacilitiesChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            อัปเดตสัญญา
          </button>
        </form>
      </div>
      <Footer />
      {showToast && <Toast message="อัปเดตสัญญาสำเร็จ!" onClose={() => setShowToast(false)} />}
    </div>
  );
};

export default UpdateContract;