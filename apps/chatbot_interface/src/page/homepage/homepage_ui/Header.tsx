function Header() {
    return (
        <header className="w-full bg-white">
            <div className="max-w-7xl mx-42 flex items-center justify-between py-4 px-5">
                {/* Left area */}
                <div className="flex items-center gap-3">
                    <div className="size-18 bg-amber-300"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-18 bg-amber-300"></div>
                </div>
            </div>

            {/* menu */}
            <nav className="flex items-center justify-between gap-6 font-medium text-gray-700 mx-47">
                <div>
                    <span className="cursor-pointer hover:text-black p-4">MyCareer ▾</span>
                    <span className="cursor-pointer hover:text-black p-4">Employability Award</span>
                    <span className="cursor-pointer hover:text-black p-4">Appointments</span>
                    <span className="cursor-pointer hover:text-black p-4">Events/Workshops</span>
                    <span className="cursor-pointer hover:text-black p-4">Jobs</span>
                    <span className="cursor-pointer hover:text-black p-4">Resources</span>
                </div>

                {/* user */}
                <div className="flex items-center gap-3">
                    <span className="bg-red-600 text-white text-sm px-2 py-0.5 rounded-full">2</span>
                    <span className="cursor-pointer hover:text-black">Khanh ▾</span>
                </div>
            </nav>
        </header>
    );
}

export default Header;
