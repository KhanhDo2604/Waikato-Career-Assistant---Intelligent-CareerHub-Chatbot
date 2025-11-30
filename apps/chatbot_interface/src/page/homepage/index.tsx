import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import ChatWidget from './ChatWidget';

function HomePage() {
    return (
        <div className="min-h-screen bg-white relative">
            <Link
                to="/dashboard"
                className="fixed top-4 right-4 btn btn-primary btn-sm gap-2 z-50 shadow-lg"
            >
                <FontAwesomeIcon icon={faChartBar} />
                Analytics Dashboard
            </Link>
            <ChatWidget />
        </div>
    );
}

export default HomePage;
