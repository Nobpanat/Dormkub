
const BookingItem = ({ booking, onSelect, onPay, onDelete, isSelected }) => {
    const { id_room, date, total_price, bookingStatus  } = booking;
    const { id_dormitory, roomtype, rent, deposit, roomImage ,roomStatus} = id_room;
    const { name, address, dormitoryImage } = id_dormitory;
    const { status } = roomStatus;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={roomImage[0] || dormitoryImage[0]}
                alt="Room"
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex items-center mb-2">
                    <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => onSelect(booking._id)} 
                        className="mr-2"
                    />
                    <h2 className="text-xl font-bold">{name}</h2>
                </div>
                <p className="text-gray-600">ที่อยู่ {address}</p>
                <p className="text-sm mt-1">ประเภทห้องพัก {roomtype}</p>
                <p className="text-sm">ราคาเช่า {rent} บาท</p>
                <p className="text-sm">ค่ามัดจำ {deposit} บาท</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="font-semibold text-gray-800">฿{total_price}</span>
                    <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                            status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                       room status {status}
                    </span>
                </div>
                {/* <div className="text-right mt-4">
                    <p className="text-xs text-gray-500">วันที่จอง: {new Date(date).toLocaleDateString()}</p>
                </div> */}
                <button 
                    onClick={() => onPay(booking)} 
                    className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
                >
                    ชำระเงิน
                </button>
                <button
                    onClick={() => {
                        console.log('Delete button clicked for:', booking._id); 
                        onDelete(booking._id);
                    }}
                    className="mt-2 w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600"
                >
                    ลบ
                </button>
            </div>
        </div>
    );
};


export default BookingItem;