import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../constants/icons';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import colors from '../../../constants/colors';
import type { ChatMessage } from '../../../constants/type/chat';

function ChatModal() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'bot',
            text: 'Hello! How can I help you today?',
            createAt: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const bgColor = colors.colors.primary;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmedText = inputText.trim();

        if (!trimmedText) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: trimmedText,
            createAt: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        const question = trimmedText;
        setInputText('');

        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
        }

        // AI bot response start
        setIsBotTyping(true);

        try {
            // AI handling logic
            const botReply = await new Promise<string>((resolve) =>
                setTimeout(() => resolve("I'm here to help!"), 2000),
            );

            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: botReply as string,
                createAt: new Date(),
            };

            // AI bot response end
            setIsBotTyping(false);
            setMessages((prev) => [...prev, botMessage]);

            // Save interaction to backend
            try {
                await api.saveInteraction(userId, userType, question, botReply);
            } catch (saveError) {
                console.error('Failed to save interaction:', saveError);
                // Don't show error to user, just log it
            }
        } catch (error) {
            setIsBotTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 2).toString(),
                    sender: 'bot',
                    text: 'Sorry, something went wrong. Please try again later.',
                    createAt: new Date(),
                },
            ]);
            console.log(error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);

        const el = e.target;
        el.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 72) + 'px';
    };

    return (
        <div className="fixed bottom-24 right-6 w-86 h-120 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-3 flex items-center border border-b-gray-200 border-b-2">
                <div className="avatar">
                    <div className={`w-10 bg-[#f11d1d] rounded-full items-center justify-center flex mr-3`}>
                        <FontAwesomeIcon icon={icons.icon.bot} />
                    </div>
                </div>

                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-black">CareerHub</span>
                        <span className="text-sm text-gray-500">How can I assist you today?</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="select select-sm select-bordered text-xs"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value as 'user' | 'alumni')}
                    >
                        <option value="user">User</option>
                        <option value="alumni">Alumni</option>
                    </select>
                </div>
            </div>

            {/* Chat content */}
            <div
                className="flex-1 space-y-2 overflow-y-auto p-3"
                style={{
                    scrollbarColor: '#d1d5db transparent',
                }}
            >
                {messages.map((m) => (
                    <div key={m.id} className={`flex items-end gap-2 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                        <div
                            className={`max-w-[75%] 
                                rounded-2xl 
                                px-3 py-2 text-sm 
                                leading-snug 
                                wrap-break-word
                                whitespace-pre-wrap
                                animate-[fadeInUp_0.18s_ease-out]
                                ${m.sender === 'user' ? `bg-[${bgColor}] text-white rounded-br-none` : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
                {isBotTyping && (
                    <div className="flex items-end gap-2">
                        <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}></div>
            </div>

            {/* Input area */}
            <div className="p-3">
                <form onSubmit={handleSubmit} className="flex bg-gray-200 rounded-lg items-center gap-2">
                    <textarea
                        ref={textAreaRef}
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                        className="flex-1
                            min-h-10
                            max-h-18
                            bg-transparent
                            resize-none
                            overflow-y-auto
                            text-black
                            text-sm
                            px-3 py-2
                            rounded-md
                            focus:outline-none
                            placeholder:text-gray-500
                            placeholder:text-sm
                            placeholder:text-left
                        "
                        rows={1}
                    />
                    <button
                        type="submit"
                        className={`btn btn-sm ml-1 border-0 shadow-none btn-circle m-2 ${inputText.length === 0 ? 'btn-disabled bg-gray-300' : `bg-[${bgColor}]`}`}
                    >
                        <FontAwesomeIcon icon={icons.icon.send} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatModal;
