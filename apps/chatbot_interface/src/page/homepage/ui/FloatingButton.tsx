import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../constants/icons';
import colors from '../../../constants/colors';

type FloatingButtonProps = {
    modalIsOpen?: boolean;
    onClick: () => void;
};

function FloatingButton({ modalIsOpen = false, onClick }: FloatingButtonProps) {
    const bgColor = colors.colors.primary;
    return (
        <button
            className={`btn btn-circle border-none fixed bottom-8 right-8 btn-lg bg-[${bgColor}]`}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={!modalIsOpen ? icons.icon.chatIcon : icons.icon.downChevron} />
        </button>
    );
}

export default FloatingButton;
