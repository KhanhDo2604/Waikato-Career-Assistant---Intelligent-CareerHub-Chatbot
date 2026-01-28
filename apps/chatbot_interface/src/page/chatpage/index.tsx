import icons from '../../constants/icons';
import { useEffect, useRef, useState } from 'react';
import InputBar from './chat_ui/InputBar';
import { useChat } from '../../hooks/useChat';
import MessageTag from './chat_ui/MessageTag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDashboard } from '../../hooks/useDashboard';
import QuestionsModal from './chat_ui/QuestionsModal';

function ChatPage() {
    const { state, actions } = useChat();
    const { dashboardState } = useDashboard();
    const { messages, inputText, isBotTyping, hasStarted } = state;
    const { commonQuestions } = dashboardState;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const myCareerUrl = import.meta.env.VITE_MY_CAREER_URL;
    const waikatoUniversityUrl = import.meta.env.VITE_WAIKATO_UNIVERSITY_URL;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Add ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

    const handleQuestionClick = (question: string) => {
        actions.sendMessage(question);
        setIsModalOpen(false);
    };

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w px-4 py-3 flex justify-between">
                    <div className="flex items-center gap-3">
                        <a href={myCareerUrl} target="_blank" rel="noopener noreferrer">
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
                        <a href={waikatoUniversityUrl} target="_blank" rel="noopener noreferrer">
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
                            <div className="mt-4 w-full">
                                {commonQuestions.length > 0 ? (
                                    <div className="space-y-3">
                                        {commonQuestions.slice(0, 5).map((q, index) => (
                                            <div key={q.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => actions.sendMessage(q.questions[0])}
                                                    className="w-full text-left text-sm text-gray-700 hover:text-gray-900 
                                                        transition-colors cursor-pointer underline-offset-4 
                                                        hover:underline decoration-gray-300"
                                                >
                                                    {q.questions[0]}
                                                </button>
                                                {index < Math.min(commonQuestions.length, 5) - 1 && (
                                                    <hr className="block my-3 bg-black" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i}>
                                                <div className="w-full h-5 rounded bg-gray-200/70 animate-pulse" />
                                                {i < 3 && <br className="block my-3" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Second state
                    <>
                        <div className="flex-1 min-h-0 overflow-y-auto from-gray-50 to-white">
                            <div className="max-w-3xl mx-auto w-full min-w-0 px-4 py-8 space-y-6">
                                {messages.map((m) => (
                                    <div key={m.id} className="animate-fadeIn">
                                        <MessageTag message={m} />
                                    </div>
                                ))}

                                {isBotTyping && (
                                    <div className="flex justify-start animate-fadeIn">
                                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <span
                                                    className={`w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]`}
                                                />
                                                <span
                                                    className={`w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]`}
                                                />
                                                <span className={`w-2 h-2 rounded-full bg-primary animate-bounce`} />
                                            </div>
                                            <span className="text-xs text-gray-400 ml-1">I'm thinking...</span>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} className="h-4" />
                            </div>
                        </div>

                        {/* Input area */}
                        <div className="shrink-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
                            <div className="px-4 py-4">
                                <div className="relative w-full">
                                    <button
                                        className="absolute left-0 top-1/2 -translate-y-1/2 btn btn-circle border border-gray-300
                                            hover:bg-gray-100 hover:border-gray-500 transition-all shadow-none z-10 bg-white"
                                        onClick={() => setIsModalOpen(true)}
                                        title="View common questions"
                                    >
                                        <FontAwesomeIcon icon={icons.icon.list} color="black" />
                                    </button>
                                    <div className="max-w-3xl mx-auto">
                                        <InputBar
                                            value={inputText}
                                            onChange={actions.setInputText}
                                            onSubmit={actions.sendMessage}
                                            placeholder="Ask me something"
                                            disabled={isBotTyping}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Floating Modal */}
            {isModalOpen && (
                <QuestionsModal
                    commonQuestions={commonQuestions}
                    handleQuestionClick={handleQuestionClick}
                    setIsModalOpen={setIsModalOpen}
                />
            )}
        </div>
    );
}

export default ChatPage;
