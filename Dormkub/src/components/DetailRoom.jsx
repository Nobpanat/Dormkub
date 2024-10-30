import PropTypes from "prop-types";

const DetailRoom = (props) => {
    const { room } = props;
  
    if (!room || !room.id_dormitory) {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">DetailRoom</h1>
          <p>ข้อมูลห้องพักไม่พร้อมใช้งาน</p>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col md:flex-row gap-8 p-4">
        {/* Detail Room - Left Side */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <p className="font-semibold text-xl">{room.id_dormitory.name}</p>
          <p className="text-gray-600">{room.id_dormitory.address}</p>
          <p className="text-gray-600">{room.id_dormitory.description}</p>
  
          <h2 className="mt-4 font-bold text-xl">รายละเอียดห้องพัก</h2>
          <p className="text-gray-600">{room.roomtype}</p>
          <p className="text-gray-600">{room.size} ตารางเมตร</p>
  
          <div className="mt-4">
            <h2 className="font-bold text-xl">สิ่งอำนวยความสะดวก</h2>
            <ul className="list-disc list-inside text-gray-600">
              {room.id_facilityList.facilities.map((facility) => (
                <li key={facility._id}>{facility.name}</li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Rent Details - Right Side */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md ">
          <h2 className="font-bold text-2xl mb-4">รายละเอียดค่าเช่า</h2>
          <p className="text-gray-700">ค่าเช่า: {room.rent} บาท</p>
          <p className="text-gray-700">ค่าประกัน: {room.deposit} บาท</p>
          <p className="text-gray-700">ราคาทั้งหมด: {room.totalPrice} บาท</p>
        </div>
      </div>
    );
};

DetailRoom.propTypes = {
    room: PropTypes.shape({
        id_dormitory: PropTypes.shape({
            name: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
        }).isRequired,
        roomtype: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        rent: PropTypes.number.isRequired,
        deposit: PropTypes.number.isRequired,
        totalPrice: PropTypes.number.isRequired,
        id_facilityList: PropTypes.shape({
            facilities: PropTypes.arrayOf(
                PropTypes.shape({
                    _id: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                })
            ).isRequired,
        }).isRequired,
    }).isRequired,
};

export default DetailRoom;
