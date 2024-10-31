// import PropTypes from "prop-types";

const DetailContract = (props) => {
  const { contract } = props;

  if (!contract) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">DetailRoom</h1>
        <p>ข้อมูลห้องพักไม่พร้อมใช้งาน</p>
      </div>
    );
  }
  const formatDateThai = (date) => {
    return new Date(date).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4">
      {/* Detail Room - Left Side */}
      <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
        <p className="font-semibold text-xl">{contract.DormitoryName}</p>
        <p className="text-gray-600">{contract.address}</p>
        <p className="text-gray-600">{contract.description}</p>

        <h2 className="mt-4 font-bold text-xl">รายละเอียดสัญญา</h2>
        <p className="text-gray-600">
          วันที่เริ่มสัญญา: {formatDateThai(contract.startDate)}
        </p>
        <p className="text-gray-600">
          วันที่สิ้นสุดสัญญา: {formatDateThai(contract.endDate)}
        </p>
        <h2 className="mt-4 font-bold text-xl">รายละเอียดห้องพัก</h2>

        <p className="text-gray-600">{contract.roomType}</p>
        <p className="text-gray-600">{contract.size} ตารางเมตร</p>

        {/* <div className="mt-4">
          <h2 className="font-bold text-xl">สิ่งอำนวยความสะดวก</h2>
          <ul className="list-disc list-inside text-gray-600">
            {room.id_facilityList.facilities.map((facility) => (
              <li key={facility._id}>{facility.name}</li>
            ))}
          </ul>
        </div> */}
        <h2 className="mt-4 font-bold text-xl">รายละเอียด</h2>
        <p className="text-gray-600">{contract.description}</p>
      </div>

      {/* Rent Details - Right Side */}
      <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md ">
        <div className="mt-4">
          <h2 className="font-bold text-xl">สิ่งอำนวยความสะดวก</h2>
          <ul className="list-disc list-inside text-gray-600">
            {contract.id_facilityList.facilities.map((facility) => (
              <li key={facility._id}>{facility.name}</li>
            ))}
          </ul>
        </div>
        <h2 className="font-bold text-2xl mb-4">รายละเอียดค่าเช่า</h2>
        <p className="text-gray-700">ค่าเช่า: {contract.rent} บาท</p>
        <p className="text-gray-700">ค่าประกัน: {contract.deposit} บาท</p>
        <p className="text-gray-700">ราคาทั้งหมด: {contract.totalPrice} บาท</p>
      </div>
    </div>
  );
};

export default DetailContract;
