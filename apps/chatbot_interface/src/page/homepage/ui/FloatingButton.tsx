import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'motion/react';
import icons from '../../../constants/icons';
import colors from '../../../constants/colors';
import type { FloatingButtonProps } from '../../../constants/type/widget';

function FloatingButton({ modalIsOpen = false, onClick }: FloatingButtonProps) {
    const bgColor = colors.colors.primary;

    return (
        <button
            className={`btn btn-circle border-none fixed bottom-8 right-8 btn-lg bg-[${bgColor}]`}
            onClick={onClick}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={modalIsOpen ? 'down' : 'chat'}
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    transition={{ duration: 0.12 }}
                >
                    <FontAwesomeIcon icon={!modalIsOpen ? icons.icon.chatIcon : icons.icon.downChevron} />
                </motion.span>
            </AnimatePresence>
        </button>
    );
}

export default FloatingButton;
