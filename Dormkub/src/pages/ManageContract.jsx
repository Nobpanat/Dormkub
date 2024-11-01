import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const ManageContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/contracts/getAll/contract", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setContracts(response.data.contracts);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

return (
    <>
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-grow container mx-auto p-4">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    จัดการสัญญาเช่าหอพักและลงประกาศขายสัญญาหอพัก
                </h2>
                <div className="flex justify-center mb-6">
                    <Link to={"/add-contract"}>
                        <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105">
                            ลงประกาศขายสัญญาหอพัก
                        </button>
                    </Link>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contracts.map((contract) => (
                            <div
                                key={contract._id}
                                className="bg-white shadow-md rounded-lg p-4"
                            >
                                <h3 className="text-xl font-bold">
                                    {contract.DormitoryName}
                                </h3>
                                <p>{contract.description}</p>
                                <p>ที่อยู่: {contract.address}</p>
                                <p>ค่าเช่า: {contract.rent} บาท/เดือน</p>
                                <p>เงินมัดจำ: {contract.deposit} บาท</p>
                                <p>ราคารวม: {contract.totalPrice} บาท</p>
                                <p>ประเภทห้อง: {contract.roomType}</p>
                                <p>ขนาดห้อง: {contract.size} ตร.ม.</p>
                                <p>สถานะสัญญา: {contract.contractStatus.status}</p>
                                <div className="flex overflow-x-scroll space-x-2 mt-2">
                                    {contract.roomImage.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Room Image ${index + 1}`}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                                <p>
                                    วันที่เริ่มต้น:{" "}
                                    {new Date(contract.startDate).toLocaleDateString()}
                                </p>
                                <p>
                                    วันที่สิ้นสุด:{" "}
                                    {new Date(contract.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    </>
);
};

export default ManageContract;
