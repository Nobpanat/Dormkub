// src/components/ContractItem.jsx
import React from 'react';

function ContractItem({ dormitoryName, address,description, startDate, endDate, rent, deposit, totalPrice, roomImage ,roomType }) {
    const formatDateThai = (date) => {
        return new Date(date).toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      };

  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4 mb-6 bg-white flex flex-col lg:flex-row">
      {/* Image Section */}
      <img
        src={roomImage}
        alt="ห้องพัก"
        className="mb-4 lg:mb-0 lg:mr-4 w-full lg:w-1/3 h-48 object-cover rounded-lg"
      />

      {/* Text Section */}
      <div className="flex flex-col justify-center">
        <p className="text-lg font-bold">{dormitoryName}</p>
        <p className="text-base font-bold">สัญญาหอพัก</p>
        <p className="text-gray-600">{address}</p>
        {/* <p className="text-gray-600">{description}</p> */}
        <p className="text-gray-600">วันเริ่มสัญญา: {formatDateThai(startDate)}</p>
        <p className="text-gray-600">วันหมดสัญญา: {formatDateThai(endDate)}</p>
        <p className="text-gray-800 font-medium">ค่าเช่า: {rent} บาท ต่อเดือน</p>
        <p className="text-gray-600">ประเภทห้องพัก {roomType}</p>
        {/* <p className="text-gray-800 font-medium">เงินมัดจำ: {deposit} บาท</p> */}
        {/* <p className="text-gray-800 font-medium">รวมทั้งหมด: {totalPrice} บาท</p> */}
      </div>
    </div>
  );
}

export default ContractItem;