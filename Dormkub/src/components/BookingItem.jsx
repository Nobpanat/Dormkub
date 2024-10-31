const BookingItem = ({ booking, onSelect, onPay, onDelete, isSelected, isRoom, isContract }) => {
    // ตรวจสอบข้อมูล room หรือ contract 
    const { id_room, id_contract, date, total_price, bookingStatus } = booking;
    
    // ดึงข้อมูลจาก id_room ถ้ามี
    const roomData = id_room || {};
    const { id_dormitory = {}, roomtype, rent, deposit, roomImage = [], roomStatus = {} } = roomData;
    const { name: roomName, address: roomAddress, dormitoryImage = [] } = id_dormitory;
    const { status: roomStatusLabel } = roomStatus;
    
    // ดึงข้อมูลจาก id_contract ถ้ามี
    const contractData = id_contract || {};
    const { DormitoryName, roomType, startDate, endDate, rent: rentContract,deposit: depositContract, address: contractAddress, roomImage: contractImages = [] } = contractData;
    const { status: contractStatusLabel } = (contractData.contractStatus || {});
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={isRoom ? (roomImage[0] || dormitoryImage[0]) : contractImages[0]}
                alt="Room"
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex items-center mb-2">
                    {/* <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => onSelect(booking._id)} 
                        className="mr-2"
                    /> */}
                    <h2 className="text-xl font-bold">{isRoom ? roomName : DormitoryName}</h2>
                </div>
                <p className="text-gray-600">ที่อยู่: {isRoom ? roomAddress : contractAddress}</p>
                {isRoom ? (
                    <>
                        <p className="text-sm mt-1">ประเภทห้องพัก: {roomtype}</p>
                        <p className="text-sm">ราคาเช่า: {rent} บาท</p>
                        <p className="text-sm">ค่ามัดจำ: {deposit} บาท</p>
                    </>
                ) : (
                    <>
                        <p className="text-sm mt-1">ประเภทห้องพัก: {roomType}</p>
                        <p className="text-sm">ราคาเช่า: {rentContract} บาท</p>
                        <p className="text-sm">ค่ามัดจำ: {depositContract} บาท</p>
                        <p className="text-sm">ระยะเวลาสัญญา: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</p>
                    </>
                )}
                <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold text-gray-800">฿{total_price}</span>
                    {/* <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                            (isRoom ? roomStatusLabel : contractStatusLabel) === 'active' 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                        {isRoom ? `room status: ${roomStatusLabel}` : `contract status: ${contractStatusLabel}`}
                    </span> */}
                </div>
                {/* <button 
                    onClick={() => onPay(booking)} 
                    className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
                >
                    ชำระเงิน
                </button> */}
                <button
                    onClick={() => onDelete(booking._id)}
                    className="mt-2 w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
                >
                    ลบ
                </button>
            </div>
        </div>
    );
};

export default BookingItem;
