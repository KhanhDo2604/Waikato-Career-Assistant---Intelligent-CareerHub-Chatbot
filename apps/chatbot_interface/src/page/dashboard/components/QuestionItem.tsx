import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Question } from '../../../constants/type/type';
import icons from '../../../constants/icons';

interface QuestionItemProps {
    question: Question;
    onEdit: () => void;
    onDelete: () => void;
}

export function QuestionItem({ question, onEdit, onDelete }: QuestionItemProps) {
    return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-sm lg:text-base text-gray-800 font-medium wrap-break-words mb-1">
                        {question.question}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                        <span className="badge badge-outline badge-sm">{question.category}</span>
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600 wrap-break-words line-clamp-2">{question.answer}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={onEdit}
                        className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-800 
                            border-none shadow-none hover:bg-blue-100"
                        title="Edit question"
                    >
                        <FontAwesomeIcon icon={icons.icon.edit} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="btn btn-ghost btn-xs text-red-600 hover:text-red-800 
                            hover:bg-red-100 border-none shadow-none"
                        title="Delete question"
                    >
                        <FontAwesomeIcon icon={icons.icon.bin} />
                    </button>
                </div>
            </div>
        </div>
    );
}
