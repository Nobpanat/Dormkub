import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ConfirmDelete from "../components/ConfirmDelete";

const ManageContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/contracts/${selectedItem}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContracts(contracts.filter((c) => c._id !== selectedItem));
      // alert("Dormitory deleted successfully");
    } catch (error) {
      console.error("Error deleting dormitory:", error);
      // alert("Failed to delete dormitory");
    } finally {
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
                  <div className="flex justify-between mt-4">
                    <Link to={`/update-contract/${contract._id}`}>
                      <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600">
                        แก้ไข
                      </button>
                    </Link>
                      <button className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
                        onClick={() => handleDeleteItem(contract._id)}
                      >     
                        ลบสัญญาหอพัก
                      </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
      {showConfirmModal && (
        <ConfirmDelete
          message="คุณแน่ใจว่าต้องการลบสัญญาหอพักนี้?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default ManageContract;
