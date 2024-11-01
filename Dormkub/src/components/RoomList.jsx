import RoomCard from "./RoomCard";

const RoomList = ({ rooms }) => {
  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">ห้องพักในหอพักนี้:</h4>
      <div className="space-y-4">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
