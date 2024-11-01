import DormitoryCard from "./DormitoryCard";

const DormitoryList = ({ dormitories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dormitories.map((dormitory) => (
        <DormitoryCard key={dormitory._id} dormitory={dormitory} />
      ))}
    </div>
  );
};

export default DormitoryList;
