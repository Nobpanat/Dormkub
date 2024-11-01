import RoomList from "./RoomList";

const DormitoryCard = ({ dormitory }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-xl font-bold">{dormitory.name}</h3>
      <p>{dormitory.description}</p>
      <p>{dormitory.address}</p>
      <div className="flex overflow-x-scroll space-x-2 mt-2">
        {dormitory.dormitoryImage.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Dormitory ${dormitory.name}`}
            className="w-32 h-32 object-cover rounded-lg"
          />
        ))}
      </div>
      <RoomList rooms={dormitory.rooms} />
    </div>
  );
};

export default DormitoryCard;
