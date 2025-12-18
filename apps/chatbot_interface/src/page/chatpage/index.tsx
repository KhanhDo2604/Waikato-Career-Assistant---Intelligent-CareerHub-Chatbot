import icons from '../../constants/icons';
import { useEffect, useRef } from 'react';
import InputBar from './chat_ui/InputBar';
import { useChat } from '../../hooks/useChat';
import MessageTag from './chat_ui/MessageTag';

function ChatPage() {
    const { state, actions } = useChat();
    const { messages, inputText, isBotTyping, hasStarted, questions } = state;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const myCareerUrl = import.meta.env.VITE_MY_CAREER_URL;
    const waikatoUniversityUrl = import.meta.env.VITE_WAIKATO_UNIVERSITY_URL;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w px-4 py-3 flex justify-between">
                    <div className="flex items-center gap-3">
                        <a href={myCareerUrl}>
                            <img src={icons.icon.mycareer_logo} alt="mycareer_logo" width={48} />
                        </a>
                        <div>
                            <h1 className="font-semibold text-gray-900">CareerHub Assistant</h1>
                            <p className="text-xs text-gray-500">
                                Ask career-related questions about CVs, jobs, appointments and more.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <a href={waikatoUniversityUrl}>
                            <img src={icons.icon.university_logo} alt="university logo" className="h-12 w-auto" />
                        </a>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 min-h-0 flex flex-col">
                {!hasStarted ? (
                    // Initial state
                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                                How can CareerHub help you today?
                            </h2>
                        </div>

                        <div className="w-full max-w-2xl">
                            <InputBar
                                value={inputText}
                                onChange={actions.setInputText}
                                onSubmit={actions.sendMessage}
                                placeholder="Ask anything about CVs, internships, jobs..."
                            />
                            {/* list of questions */}
                            <div className="mt-4 w-full space-y-2">
                                {questions.length > 0 ? (
                                    questions.slice(0, 5).map((q) => (
                                        <button
                                            key={q.id}
                                            type="button"
                                            onClick={() => actions.sendMessage(q.question)}
                                            className="w-full text-left px-3 py-2 rounded-xl bg-white border border-gray-200
                                                hover:bg-gray-50 hover:border-gray-300 transition
                                                text-sm text-gray-700 cursor-pointer"
                                        >
                                            {q.question}
                                        </button>
                                    ))
                                ) : (
                                    <div className="space-y-2">
                                        {/* fallback skeleton */}
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-full h-11 rounded-xl bg-gray-200/70 animate-pulse"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Second state
                    <>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="max-w-4xl mx-auto w-full min-w-0 px-4 py-6 space-y-4">
                                {messages.map((m) => (
                                    <MessageTag key={m.id} message={m} />
                                ))}

                                {isBotTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input area */}
                        <div className="shrink-0 border-t border-gray-200 bg-linear-to-t from-gray-50 to-gray-50/60">
                            <div className="max-w-4xl mx-auto px-4 py-3">
                                <InputBar
                                    value={inputText}
                                    onChange={actions.setInputText}
                                    onSubmit={actions.sendMessage}
                                    placeholder="Ask me something"
                                    disabled={isBotTyping}
                                />
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default ChatPage;
