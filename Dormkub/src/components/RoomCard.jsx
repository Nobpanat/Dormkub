const RoomCard = ({ room }) => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h5 className="text-md font-semibold">{room.roomtype}</h5>
        <p>ขนาด: {room.size} ตร.ม.</p>
        <p>ค่าเช่า: {room.rent} บาท/เดือน</p>
        <p>เงินมัดจำ: {room.deposit} บาท</p>
        <p>ราคารวม: {room.totalPrice} บาท</p>
        <p>จำนวนห้องที่เหลือ {room.amount}</p>
        <div className="flex overflow-x-scroll space-x-2 mt-2">
          {room.roomImage.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Room ${room.roomtype}`}
              className="w-24 h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default RoomCard;
  