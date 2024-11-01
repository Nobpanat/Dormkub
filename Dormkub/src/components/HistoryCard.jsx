import React from "react";

const HistoryCard = ({ booking }) => {
    const {
        id_room,
        id_contract,
        total_price,
        date,
    } = booking;

    const formatDateThai = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };
    
    return (
        <div className="bg-white w-80 p-4 shadow-sm rounded-md transition-transform transform hover:scale-105">
            <p className={`text-xs font-bold mb-1 ${!id_room ? "text-red-600" : "text-green-600"}`}>
                {id_room ? "หอพัก    " : "สัญญาหอพัก"}
            </p>
            <h2 className="text-md font-semibold text-gray-800 mb-1">
                {id_room ? id_room.id_dormitory.name : id_contract.DormitoryName}
            </h2>
            <p className="text-xs text-gray-500 mb-1">
                {id_room ? id_room.id_dormitory.address : id_contract.address}
            </p>
            <p className="text-xs text-gray-600 mb-1">
                ประเภทห้อง: {id_room ? id_room.roomtype : id_contract.roomType}
            </p>
            <p className="text-xs text-gray-600 mb-1">
                ขนาดห้อง: {id_room ? `${id_room.size} ตร.ม.` : `${id_contract.size} ตร.ม.`}
            </p>
            <p className="text-xs text-gray-600 mb-1">
                ราคาเช่า: ฿{id_room ? id_room.rent : id_contract.rent}
            </p>
            <p className="text-xs text-gray-600 mb-1">
                มัดจำ: ฿{id_room ? id_room.deposit : id_contract.deposit}
            </p>
            {id_contract && (
                <>
                    <p className="text-xs text-gray-600 mb-1">
                        วันเริ่มสัญญา: {formatDateThai(id_contract.startDate)}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                        วันหมดสัญญา: {formatDateThai(id_contract.endDate)}
                    </p>
                </>
            )}
            <p className="text-xs text-gray-800 font-semibold mb-2">
                ราคาเต็ม: ฿{total_price}
            </p>
            <div className="flex gap-2">
                {(id_room ? id_room.roomImage : id_contract.roomImage)?.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt="Room"
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                ))}
            </div>
        </div>
    );
};

export default HistoryCard;
