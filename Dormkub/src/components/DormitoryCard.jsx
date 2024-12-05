import { Link } from "react-router-dom";
import RoomList from "./RoomList";

const DormitoryCard = ({ dormitory, onDelete }) => {
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
      <div className="flex justify-between mt-4">
        <Link to={`/update-dormitory/${dormitory._id}`}>
          <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600">
            อัปเดตหอพัก
          </button>
        </Link>
        <button
          onClick={() => onDelete(dormitory._id)}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
        >
          ลบหอพัก
        </button>
      </div>
    </div>
  );
};

export default DormitoryCard;