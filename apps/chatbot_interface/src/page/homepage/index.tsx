// import ChatWidget from './ChatWidget';

import ChatWidget from './ChatWidget';
import Footer from './homepage_ui/Footer';
import Header from './homepage_ui/Header';

function HomePage() {
    const tempData1 = [
        {
            title: 'Need CV help?',
            text: 'Discover how to make a standout CV that grabs employers’ attention.',
            color: 'bg-purple-600/60',
            img: '/cv-help.jpg',
        },
        {
            title: 'Prepare your Cover Letter',
            text: 'Learn how to write a covering letter that tells your story.',
            color: 'bg-blue-600/60',
            img: '/cover-letter.jpg',
        },
        {
            title: 'Workshops',
            text: 'Improve your career skills by attending our workshops.',
            color: 'bg-orange-600/60',
            img: '/workshop.jpg',
        },
        {
            title: 'Drop ins & Online Career Chats',
            text: 'Quick career chat with a consultant.',
            color: 'bg-green-600/60',
            img: '/dropin.jpg',
        },
    ];

    const tempData2 = [
        {
            title: 'Meet the Team',
            text: 'Learn more about our team, roles, and how we can support your journey.',
            img: '/team.jpg',
        },
        {
            title: 'Career Expos',
            text: 'Your opportunity to connect with employers.',
            img: '/expo.jpg',
        },
        {
            title: 'Resources',
            text: 'Download tools to support your career growth.',
            img: '/resources.jpg',
        },
    ];

    const tempEvents = [
        { title: 'Interview (ONLINE)', date: '4 Dec 2025' },
        { title: 'Job Search (ONLINE)', date: '5 Dec 2025' },
        { title: 'AI Assist - Upgrade Your Applic...', date: '10 Dec 2025' },
        { title: 'CV (ONLINE)', date: '7 Jan 2026' },
        { title: 'Interview skills (ONLINE)', date: '15 Jan 2026' },
    ];

    return (
        <div className="min-h-screen bg-white text-black overflow-auto relative">
            <Header />

            <section className="w-full mt-8 relative">
                {/* img */}
                <div className="h-38 bg-amber-200 mx-47"></div>

                <div className="absolute inset-0 flex items-center px-54">
                    <h1 className="text-white text-4xl font-bold">Careers & Employability Services</h1>
                </div>
            </section>

            {/* FEATURE CARDS */}
            <section className="max-w-7xl mx-42 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 px-5">
                {tempData1.map((card, i) => (
                    <div key={i} className="relative overflow-hidden shadow-md cursor-pointer group">
                        <img
                            src={card.img}
                            alt={card.title}
                            className="w-full size-58 object-cover group-hover:scale-105 transition"
                        />
                        <div className={`absolute inset-0 ${card.color} p-5 flex flex-col justify-end text-white`}>
                            <h2 className="font-bold text-xl">{card.title}</h2>
                            <p className="text-sm mt-2">{card.text}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* new section here */}
            <section className="max-w-7xl mx-42 pb-12 px-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Upcoming events */}
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col h-64">
                    <h2 className="font-semibold text-lg mb-3">Upcoming events</h2>
                    <div className="flex-1 overflow-y-auto text-sm">
                        {tempEvents.map((event, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between py-1.5 border-b last:border-b-0"
                            >
                                <span className="pr-2">{event.title}</span>
                                <span className="text-gray-600 whitespace-nowrap text-xs">{event.date}</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-3 text-sm text-blue-700 hover:underline text-left">Find more events</button>
                </div>

                {/* Middle: nzuni talent search */}
                <div className="relative bg-gray-300 rounded-lg overflow-hidden h-64 flex items-center justify-center">
                    {/* Background image */}
                    <img
                        src="/nzuni-talent.jpg"
                        alt="nzuni talent"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay content */}
                    <div className="relative flex flex-col items-center">
                        <div className="mb-6 text-center">
                            <p className="text-white text-4xl font-extrabold leading-tight tracking-tight">
                                nzuni
                                <br />
                                talent
                            </p>
                        </div>
                        <div className="w-72 bg-white/80 rounded-full flex items-center px-4 py-2">
                            <input
                                type="text"
                                placeholder="Search for jobs..."
                                className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-500"
                            />
                            <button className="ml-2 w-7 h-7 rounded-full border border-gray-400 flex items-center justify-center text-xs">
                                🔍
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Ask a question */}
                <div className="bg-white shadow-md rounded-lg p-4 h-64 flex flex-col">
                    <h2 className="font-semibold text-lg mb-3">Ask a question</h2>
                    <input
                        type="text"
                        placeholder="What is your question about?"
                        className="border border-gray-300 rounded-sm px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <textarea
                        placeholder="Write your question"
                        className="border border-gray-300 rounded-sm px-3 py-2 text-sm flex-1 resize-none mb-4 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-sm">
                        Ask question
                    </button>
                </div>
            </section>

            {/* EMPLOYABILITY AWARD BANNER */}
            <section className="w-full mt-8 relative">
                {/* img */}
                <div className="h-38 bg-amber-200 mx-47"></div>

                <div className="absolute inset-0 flex items-center px-54">
                    <h1 className="text-white text-4xl font-bold">Employability Plus Award</h1>
                </div>
            </section>

            {/* INFO CARDS */}
            <section className="max-w-7xl mx-45 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-5">
                {tempData2.map((card, i) => (
                    <div key={i} className="relative overflow-hidden shadow-md cursor-pointer group">
                        <img
                            src={card.img}
                            alt={card.title}
                            className="w-full size-90 object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/50 text-white p-5 flex flex-col justify-end">
                            <h2 className="text-2xl font-bold">{card.title}</h2>
                            <p className="text-sm mt-2">{card.text}</p>
                        </div>
                    </div>
                ))}
            </section>
            <Footer />
            <ChatWidget />
        </div>
    );
}

export default HomePage;
