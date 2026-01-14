import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Question } from '../../../constants/type/type';
import icons from '../../../constants/icons';

function QuestionsModal({
    commonQuestions,
    handleQuestionClick,
    setIsModalOpen,
}: {
    commonQuestions: Question[];
    handleQuestionClick: (question: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FontAwesomeIcon icon={icons.icon.list} size="lg" className="bg-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900">Common Questions</h3>
                            <p className="text-xs lg:text-sm text-gray-500">Select a question to get started</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
                    >
                        <FontAwesomeIcon icon={icons.icon.cancle} size="lg" color="#000000" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-4 lg:p-6">
                    {commonQuestions.length > 0 ? (
                        <div className="space-y-2">
                            {commonQuestions.map((q, index) => (
                                <button
                                    key={q.id}
                                    onClick={() => handleQuestionClick(q.question)}
                                    className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-red-50 
                                                border border-gray-200 hover:border-red-300
                                                transition-all group"
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className="shrink-0 w-6 h-6 flex items-center justify-center 
                                                    rounded-full bg-red-100 text-red-600 text-xs font-semibold
                                                    group-hover:bg-red-600 group-hover:text-white transition-colors"
                                        >
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm lg:text-base text-gray-800 group-hover:text-red-900 
                                                        font-medium transition-colors wrap-break-words"
                                            >
                                                {q.question}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{q.category}</p>
                                        </div>
                                        <FontAwesomeIcon icon={icons.icon.list} className="bg-primary" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mb-4 opacity-50"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-sm font-medium">No common questions available</p>
                            <p className="text-xs mt-1">Questions will appear here once added</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionsModal;
