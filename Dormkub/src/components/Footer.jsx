const Footer = () => {
    return (
        <footer className="bg-[#03045E] pl-24 pr-24 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    {/* Left section */}
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-2xl font-bold mb-4">Dormkub</h3>
                        <p className="mb-2">Email: example@mail.com</p>
                        <p className="mb-2">Line: @dormkub</p>
                        <p>02-xxxx-xxxx</p>
                    </div>

                    {/* Right section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="mb-2">Facebook: Dormkub</p>
                        <p className="mb-2">Line: @dormkub</p>
                        <p className="mb-2">Instagram: @dormkub</p>
                        <p>Terms of Service</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
