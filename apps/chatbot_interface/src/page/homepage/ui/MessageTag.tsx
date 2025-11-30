import colors from '../../../constants/colors';
import type { ChatMessage } from '../../../constants/type/chat';

function MessageTag({ message }: { message: ChatMessage }) {
    const bgColor = colors.colors.primary;

    return (
        <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
            <div
                className={`max-w-[75%] 
                                rounded-2xl 
                                px-3 py-2 text-sm 
                                leading-snug 
                                wrap-break-word
                                whitespace-pre-wrap
                                animate-[fadeInUp_0.18s_ease-out]
                                ${message.sender === 'user' ? `bg-[${bgColor}] text-white rounded-br-none` : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
            >
                {message.text}
            </div>
        </div>
    );
}

export default MessageTag;
