import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Question } from '../../../constants/type/type';
import icons from '../../../constants/icons';
import { ConfirmDialog } from './ConfirmDialog';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';

interface QuestionItemProps {
    question: Question;
    onEdit: () => void;
    onDelete: () => void;
    onToggleCommon?: (currentQuestion: Question) => void;
}

export function QuestionItem({ question, onEdit, onDelete, onToggleCommon }: QuestionItemProps) {
    const toggleDialog = useConfirmDialog();
    const deleteDialog = useConfirmDialog();

    const isCommon = question.common;

    const handleToggleConfirm = () => {
        onToggleCommon?.({
            ...question,
            common: !isCommon,
        });
        toggleDialog.close();
    };

    const handleDeleteConfirm = () => {
        onDelete();
        deleteDialog.close();
    };

    return (
        <>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-center pt-1">
                        <input
                            type="checkbox"
                            checked={isCommon}
                            onChange={toggleDialog.open}
                            className="checkbox checkbox-primary checkbox-sm rounded"
                            title={isCommon ? 'Common question' : 'Mark as common'}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm lg:text-base text-gray-800 font-medium wrap-break-words mb-1">
                            {question.question}
                        </p>

                        <p className="text-xs text-gray-500 mb-2">
                            <span className="badge badge-outline badge-sm">{question.category}</span>
                        </p>

                        <p className="text-xs lg:text-sm text-gray-600 wrap-break-words line-clamp-2">
                            {question.answer}
                        </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={onEdit}
                            className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 border-none shadow-none"
                            title="Edit question"
                        >
                            <FontAwesomeIcon icon={icons.icon.edit} />
                        </button>

                        <button
                            onClick={deleteDialog.open}
                            className="btn btn-ghost btn-xs text-red-600 hover:text-red-800 hover:bg-red-100 border-none shadow-none"
                            title="Delete question"
                        >
                            <FontAwesomeIcon icon={icons.icon.bin} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Common Dialog */}
            <ConfirmDialog
                isOpen={toggleDialog.isOpen}
                title={isCommon ? 'Remove from Common Questions?' : 'Mark as Common Question?'}
                message={
                    isCommon
                        ? "Are you sure you want to remove this question from common questions? It will no longer be displayed on the chatbot's home screen."
                        : "Do you want to mark this question as a common question? It will be displayed on the chatbot's home screen for quick access."
                }
                confirmText={isCommon ? 'Remove' : 'Mark as Common'}
                confirmButtonClass={isCommon ? 'bg-red-600 hover:bg-red-700' : 'bg-primary'}
                icon={icons.icon.questionCircle}
                iconBgColor="bg-red-100"
                iconColor="text-primary"
                previewContent={{
                    label: 'Question:',
                    value: question.question,
                }}
                onConfirm={handleToggleConfirm}
                onCancel={toggleDialog.close}
            />

            {/* Delete Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Question?"
                message="Are you sure you want to delete this question? This action cannot be undone."
                confirmText="Delete"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                icon={icons.icon.bin}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
                previewContent={{
                    label: 'Question to delete:',
                    value: question.question,
                }}
                onConfirm={handleDeleteConfirm}
                onCancel={deleteDialog.close}
            />
        </>
    );
}
