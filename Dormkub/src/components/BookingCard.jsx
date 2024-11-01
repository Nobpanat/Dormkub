const BookingCard = ({ booking }) => {
    const { id_room, id_contract, total_price } = booking;
  
    // ดึงข้อมูลจาก id_room ถ้ามี
    const roomData = id_room || {};
    const { id_dormitory = {}, roomtype, rent, deposit, roomImage = [] } = roomData;
    const { name: roomName, address: roomAddress, dormitoryImage = [] } = id_dormitory;
  
    // ดึงข้อมูลจาก id_contract ถ้ามี
    const contractData = id_contract || {};
    const { DormitoryName, roomType, startDate, endDate, rent: rentContract, deposit: depositContract, address: contractAddress, roomImage: contractImages = [] } = contractData;
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-xs mx-auto">
        <img
          src={roomImage[0] || dormitoryImage[0] || contractImages[0]}
          alt="Room or Contract"
          className="w-full h-32 object-cover"
        />
        <div className="p-2">
          <h2 className="text-lg font-semibold">
            {roomName || DormitoryName}
          </h2>
          <p className="text-sm text-gray-600">
            ที่อยู่: {roomAddress || contractAddress}
          </p>
          {id_room ? (
            <>
              <p className="text-sm">ประเภทห้องพัก: {roomtype}</p>
              <p className="text-sm">ราคาเช่า: {rent} บาท</p>
              <p className="text-sm">ค่ามัดจำ: {deposit} บาท</p>
            </>
          ) : (
            <>
              <p className="text-sm">ประเภทห้องพัก: {roomType}</p>
              <p className="text-sm">ราคาเช่า: {rentContract} บาท</p>
              <p className="text-sm">ค่ามัดจำ: {depositContract} บาท</p>
              <p className="text-sm">
                ระยะเวลาสัญญา: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </p>
            </>
          )}
          <div className="mt-2 text-right">
            <span className="text-sm font-semibold text-gray-800">฿{total_price}</span>
          </div>
        </div>
      </div>
    );
  };

export default BookingCard;
