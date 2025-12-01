import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../constants/icons';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import colors from '../../../constants/colors';
import type { ChatMessage } from '../../../constants/type/chat';

function ChatModal() {
    const topicList = ['General Inquiry', 'Technical Support', 'Billing', 'Feedback', 'Other'];
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
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
    const [isInputFocused, setIsInputFocused] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const bgColor = colors.colors.primary;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text: string) => {
        const trimmedText = text.trim();
        if (!trimmedText || isBotTyping) return;

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        sendMessage(inputText);
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);

        const el = e.target;
        el.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 72) + 'px';
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputText);
        }
    };

    const handleSelectTopic = (topic: string) => {
        setSelectedTopic(topic);

        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 3).toString(),
                sender: 'bot',
                text: `Great! You selected "${topic}". What would you like to ask about this topic?`,
                createAt: new Date(),
            },
        ]);

        textAreaRef.current?.focus();
    };

    return (
        <div className="fixed bottom-24 right-6 w-90 h-120 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-3 flex items-center border border-b-gray-200 border-x-0 border-t-0 border-b-2">
                <div className="avatar">
                    <div className={`w-10 bg-[#f11d1d] rounded-full items-center justify-center flex mr-3`}>
                        <FontAwesomeIcon icon={icons.icon.bot} color="white" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="font-bold text-lg text-black">CareerHub</span>
                    <span className="text-sm text-gray-500">
                        {selectedTopic ? `Topic: ${selectedTopic}` : 'Please select a topic to start'}
                    </span>
                </div>
            </div>

            {/* Chat content */}
            <div
                className="flex-1 space-y-2 overflow-y-auto p-3 relative"
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

                {/* topic select before asking */}
                {!selectedTopic && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 max-w-xs w-full">
                            <p className="text-sm font-semibold mb-3 text-gray-800 text-center">
                                Please select a topic to get started
                            </p>
                            <div className="flex flex-col gap-2">
                                {topicList.map((topic) => (
                                    <button
                                        key={topic}
                                        type="button"
                                        className="w-full text-sm text-left px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-black transition"
                                        onClick={() => handleSelectTopic(topic)}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}></div>
            </div>

            {/* Input area */}
            <div className="p-3">
                <form
                    onSubmit={handleSubmit}
                    className={`flex bg-gray-200 rounded-lg items-center gap-2 px-2
                    ${isInputFocused ? 'ring-1 ring-black' : 'ring-0'}
                    `}
                >
                    <textarea
                        ref={textAreaRef}
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        disabled={!selectedTopic}
                        placeholder={`${selectedTopic ? 'Type your message...' : 'Select a topic to start chatting'}`}
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
                        className={`btn btn-sm ml-1 border-0 shadow-none btn-circle m-2 ${inputText.length === 0 || !selectedTopic ? 'btn-disabled bg-gray-300' : `bg-[${bgColor}]`}`}
                    >
                        <FontAwesomeIcon icon={icons.icon.send} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatModal;
