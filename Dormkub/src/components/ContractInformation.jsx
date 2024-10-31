const ContractInformation = ({ dormName, address, rent }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">สัญญาหอพัก</h1>
          <h1 className="text-2xl font-bold text-blue-600">{dormName}</h1>
          <p className="text-gray-600 mt-2">{address}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-600">ค่าเช่า</h2>
          <p className="text-gray-600 mt-2">{rent} บาท/เดือน</p>
        </div>
      </div>
    </div>
  );
};

export default ContractInformation;
