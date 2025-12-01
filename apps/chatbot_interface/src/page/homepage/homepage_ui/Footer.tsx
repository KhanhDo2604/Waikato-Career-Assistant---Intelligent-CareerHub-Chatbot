import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../constants/icons';

function Footer() {
    return (
        <footer className="bg-black text-white py-6 mt-16">
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex justify-center gap-4 text-2xl mb-4">
                    <FontAwesomeIcon icon={icons.icon.faceBook} />
                    <FontAwesomeIcon icon={icons.icon.instagram} />
                    <FontAwesomeIcon icon={icons.icon.linkedIn} />
                </div>
                <p className="text-gray-400">Powered By Symplicity</p>
            </div>
        </footer>
    );
}

export default Footer;
