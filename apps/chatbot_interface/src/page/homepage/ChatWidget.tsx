import { useState } from 'react';
import FloatingButton from './ui/FloatingButton';
import ChatModal from './ui/ChatModal';

function ChatWidget() {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <>
            {/* <ChatModal /> */}
            {modalIsOpen && <ChatModal />}

            {/* {FLoating button at the corner} */}
            <FloatingButton modalIsOpen={modalIsOpen} onClick={() => setModalIsOpen(!modalIsOpen)} />
        </>
    );
}

export default ChatWidget;
