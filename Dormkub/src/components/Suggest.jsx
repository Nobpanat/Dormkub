// src/components/Suggest.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ContractItem from "./ContractItem";

function DormItem({ imgSrc, dormName, address, price, specialText, roomType }) {
  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4 bg-white flex flex-col text-center">
      <img
        src={imgSrc}
        alt="ห้องพัก"
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      {specialText && (
        <p className="text-sm text-blue-600 font-semibold mb-1">
          {specialText}
        </p>
      )}
      <h3 className="text-lg font-bold text-gray-800">{dormName}</h3>
      <p className="text-gray-600">{address}</p>
      <p className="text-gray-800 font-medium">ค่าเช่า: {price} บาท ต่อเดือน</p>
      <p className="text-gray-600">ประเภทห้องพัก {roomType}</p>
    </div>
  );
}

const Suggest = () => {
  const [suggestRooms, setSuggestRooms] = useState([]);
  const [contractRooms, setContractRooms] = useState([]);
  const [filter, setFilter] = useState({
    ownerDorm: false,
    contractSell: false,
  });

  useEffect(() => {
    const fetchSuggestRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/rooms/getAll/SuggestRooms"
        );
        setSuggestRooms(response.data);
      } catch (error) {
        console.error("Error fetching suggest rooms:", error);
      }
    };

    const fetchContractRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/contracts/"
        );
        setContractRooms(response.data);
      } catch (error) {
        console.error("Error fetching contract rooms:", error);
      }
    };

    fetchSuggestRooms();
    fetchContractRooms();
  }, []);

  const filteredRooms = filter.ownerDorm
    ? suggestRooms.filter((room) => room.roomStatus === "owner")
    : suggestRooms;

  const filteredContracts = filter.contractSell
    ? contractRooms.filter((contract) => contract.roomStatus === "contract")
    : contractRooms;

  return (
    <div className="text-center">
      <div className="p-3 border border-gray-300 rounded-md shadow bg-white mb-4 max-w-xs mx-auto flex flex-col items-center space-y-3">
  <h3 className="text-md font-semibold">กรองการค้นหา</h3>
  <div className="flex space-x-3">
    <label className="flex items-center text-sm">
      <input
        type="checkbox"
        checked={filter.ownerDorm}
        onChange={() => setFilter((prev) => ({ ...prev, ownerDorm: !prev.ownerDorm }))}
        className="mr-1"
      />
      ขายสัญญาหอพัก
    </label>
    <label className="flex items-center text-sm">
      <input
        type="checkbox"
        checked={filter.contractSell}
        onChange={() => setFilter((prev) => ({ ...prev, contractSell: !prev.contractSell }))}
        className="mr-1"
      />
      หอพักจากเจ้าของหอพัก
    </label>
  </div>
</div>

<button className="bg-blue-800 text-white px-4 py-2 rounded-md mb-4 font-semibold text-sm max-w-xs mx-auto">
  หอพักแนะนำ
</button>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <Link to={`/room/${room._id}`} key={room._id}>
            <DormItem
              imgSrc={room.roomImage[0] || "https://placehold.co/300x200"}
              dormName={room.id_dormitory.name}
              address={room.id_dormitory.address}
              price={room.rent}
              specialText={room.roomStatus === "active" ? "ขายสัญญาหอพัก" : ""}
              roomType={room.roomtype}
            />
          </Link>
        ))}

        <h2 className="text-xl font-bold col-span-full text-center mt-8">
          รายการสัญญา
        </h2>

        {filteredContracts.map((contract) => (
          <Link to={`/contract/${contract._id}`} key={contract._id}>
            <ContractItem
              dormitoryName={contract.DormitoryName}
              address={contract.address}
              description={contract.description}
              startDate={contract.startDate}
              endDate={contract.endDate}
              rent={contract.rent}
              deposit={contract.deposit}
              totalPrice={contract.totalPrice}
              roomImage={contract.roomImage[0]}
              roomType={contract.roomType}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Suggest;
