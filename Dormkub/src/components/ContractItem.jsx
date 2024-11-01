// src/components/ContractItem.jsx
import React from 'react';

function ContractItem({
  dormitoryName,
  address,
  description,
  startDate,
  endDate,
  rent,
  deposit,
  totalPrice,
  roomImage,
  roomType,
}) {
  const formatDateThai = (date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg shadow-lg p-5 mb-8 bg-white flex flex-col items-center">
      {/* Image Section */}
      <img
        src={roomImage}
        alt="ห้องพัก"
        className="w-full h-52 object-cover rounded-lg mb-4"
      />

      {/* Text Section */}
      <div className="text-center space-y-2">
        <p className="text-xl font-bold text-gray-800">{dormitoryName}</p>
        <p className="text-blue-600 font-semibold">สัญญาหอพัก</p>
        <p className="text-gray-600">{address}</p>
        <p className="text-gray-600">วันเริ่มสัญญา: {formatDateThai(startDate)}</p>
        <p className="text-gray-600">วันหมดสัญญา: {formatDateThai(endDate)}</p>
        <p className="text-gray-800 font-medium">ค่าเช่า: {rent} บาท ต่อเดือน</p>
        <p className="text-gray-600">ประเภทห้องพัก: {roomType}</p>
      </div>

      {/* Optional Fields */}
      <div className="mt-4 space-y-1 text-gray-700">
        {deposit && <p className="text-gray-800">เงินมัดจำ: {deposit} บาท</p>}
        {totalPrice && <p className="text-gray-800">รวมทั้งหมด: {totalPrice} บาท</p>}
      </div>
    </div>
  );
}

export default ContractItem;
