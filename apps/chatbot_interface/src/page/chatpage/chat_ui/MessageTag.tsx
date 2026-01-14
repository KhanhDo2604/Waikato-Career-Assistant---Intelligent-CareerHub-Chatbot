import type { ChatMessage } from '../../../constants/type/type';

function MessageTag({ message }: { message: ChatMessage }) {
    const renderTextWithLinks = (text: string) => {
        // Regex to detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            // Check if this part is a URL
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline hover:opacity-80 transition break-all ${
                            message.sender === 'user' ? 'text-white underline-offset-2' : 'text-blue-600'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            // Regular text
            return <span key={index}>{part}</span>;
        });
    };
    return (
        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed
                    whitespace-pre-wrap wrap-break-words
                    ${
                        message.sender === 'user'
                            ? 'text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    } ${message.sender === 'user' ? 'bg-primary' : undefined}`}
            >
                <p className="mb-0">{renderTextWithLinks(message.text)}</p>
            </div>
        </div>
    );
}

export default MessageTag;
