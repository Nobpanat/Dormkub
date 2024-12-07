import { useState } from "react";

const FacilitiesCheckbox = ({ selectedFacilities, onFacilitiesChange }) => {
  const [facilitiesList] = useState([
    { id: "670fd4248ecf68f7d91328a4", name: "แอร์" },
    { id: "670fd4248ecf68f7d91328a7", name: "พัดลม" },
    { id: "670fd4248ecf68f7d91328aa", name: "เครื่องซักผ้า" },
    { id: "670fd4248ecf68f7d91328ad", name: "เครื่องทำน้ำอุ่น" },
    { id: "670fd4258ecf68f7d91328b0", name: "ตู้เย็น" },
    { id: "670fd4258ecf68f7d91328b3", name: "เตียง" },
    { id: "670fd4258ecf68f7d91328b6", name: "โต๊ะ" },
    { id: "670fd4258ecf68f7d91328b9", name: "ทีวี" },
    { id: "670fd4258ecf68f7d91328bc", name: "Wifi" },
  ]);

  const handleCheckboxChange = (facilityId) => {
    onFacilitiesChange(
      selectedFacilities.includes(facilityId)
        ? selectedFacilities.filter((id) => id !== facilityId)
        : [...selectedFacilities, facilityId]
    );
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Facilities:</label>
      <div className="flex flex-wrap">
        {facilitiesList.map((facility) => (
          <label key={facility.id} className="mr-4 mb-2 flex items-center">
            <input
              type="checkbox"
              value={facility.id}
              checked={selectedFacilities.includes(facility.id)}
              onChange={() => handleCheckboxChange(facility.id)}
              className="mr-1"
            />
            {facility.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesCheckbox;