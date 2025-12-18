import colors from '../../../constants/colors';
import type { ChatMessage } from '../../../constants/type/chat';

function MessageTag({ message }: { message: ChatMessage }) {
    const bgColor = colors.colors.primary;

    return (
        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed
          whitespace-pre-wrap wrap-break-word
          ${message.sender === 'user' ? 'text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                style={message.sender === 'user' ? { backgroundColor: bgColor } : undefined}
            >
                <p>{message.text}</p>

                {message.link && (
                    <a
                        href={message.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-blue-600 underline break-all"
                    >
                        {message.link}
                    </a>
                )}
            </div>
        </div>
    );
}

export default MessageTag;
