import logo from "../assets/images/Frame 84@2x.png";


const Bandner = () => {
  return (
    <section className="text-left mb-2 p-4 pl-20 pb-10 bg-white shadow-md border-b-4 border-[#03045E]">
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="Dormkub Logo"
          className="w-24 h-16 lg:w-28 lg:h-20"
        />
        <h2 className="text-2xl font-bold">Dormkub</h2>
      </div>
      <p className="text-sm">หาหอพักสะดวก จองซื้อขายสัญญาหอพัก รวดเร็วต้อง Dormkub</p>
    </section>
  );
};

export default Bandner;
