import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import RoomInformation from "../components/RoomInformation";
import ImageCarousel from "../components/ImageCarousel";
import ActionButtons from "../components/ActionButtons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import DetailRoom from "../components/DetailRoom";
const RoomDetails = () => {
  const { id } = useParams();
//   console.log(id);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rooms/${id}`
        );
        setRoom(response.data.room);
        // console.log(response.data.room);
      } catch (error) {
        console.error("Error fetching room details", error);
      }
    }
    fetchRoomDetails();
  }, [id]);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    // <div>
    //   <h1>{room.id_dormitory.name}</h1>
    //   <p>{room.id_dormitory.address}</p>
    //   <img src={room.roomImage[0] || "https://placehold.co/300x200"} alt="Room" />
    //   <p>Price: {room.rent}</p>
    //   <p>Status: {room.roomStatus.status}</p>
    //   {/* Add more details as needed */}
    // </div>
    <>
      <Navbar />
      <div className="p-4">
        <RoomInformation
          dormName={room.id_dormitory.name}
          address={room.id_dormitory.address}
          rent={room.rent}
          description={room.id_dormitory.description}
        />
        <ImageCarousel images={room.roomImage} />
        <ActionButtons roomId={room._id} />
        <DetailRoom room={room}/>

      </div>
      {/* <img src="https://github.com/Nobpanat/Dormkub/blob/main/DormkubImg/imgDormTong.jpg?raw=true" alt="No img" /> */}
      <Footer />
    </>
  );
};

export default RoomDetails;
