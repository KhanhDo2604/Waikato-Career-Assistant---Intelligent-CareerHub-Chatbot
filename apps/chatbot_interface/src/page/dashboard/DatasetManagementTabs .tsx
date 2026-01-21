import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactLoading from 'react-loading';
import icons from '../../constants/icons';
import { useDashboard } from '../../hooks/useDashboard';
import type { Question } from '../../constants/type/type';
import { QuestionForm } from './components/QuestionForm';
import { QuestionItem } from './components/QuestionItem';

function DatasetManagementTabs() {
    const { dashboardState, dashboardActions } = useDashboard();
    const { questions, questionsLoading, isLoading } = dashboardState;
    // Edit states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddQuestion = async (questionData: Partial<Question>) => {
        try {
            await dashboardActions.addQuestion(questionData);
            setIsAdding(false);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleEditQuestion = async (questionData: Partial<Question>) => {
        try {
            await dashboardActions.updateQuestion(questionData);
            setEditingId(null);
            setEditingQuestion(null);
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    const handleDeleteQuestion = async (id: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            try {
                await dashboardActions.deleteQuestion(id);
            } catch (error) {
                console.error('Error deleting question:', error);
            }
        }
    };

    const handleStartEdit = (question: Question) => {
        setEditingId(question.id);
        setEditingQuestion(question);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingQuestion(null);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-md">
            <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Dataset & Questions Management</h2>
                        <p className="text-sm text-gray-600">Manage common questions used by the chatbot</p>
                    </div>

                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
                        >
                            <FontAwesomeIcon icon={icons.icon.plus} />
                            Add Question
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="h-[360px] overflow-y-auto pr-1">
                    <div className="space-y-4">
                        {/* Add Form */}
                        {isAdding && (
                            <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4 shadow-md">
                                <QuestionForm mode="add" onSubmit={handleAddQuestion} onCancel={handleCancelAdd} />
                            </div>
                        )}

                        {/* Common questions list */}
                        {questions.map((item) => (
                            <div key={item.id}>
                                {editingId === item.id && editingQuestion ? (
                                    <QuestionForm
                                        mode="edit"
                                        initialData={editingQuestion}
                                        onSubmit={(data) => handleEditQuestion(data)}
                                        onCancel={handleCancelEdit}
                                    />
                                ) : (
                                    <QuestionItem
                                        question={item}
                                        onEdit={() => handleStartEdit(item)}
                                        onDelete={() => handleDeleteQuestion(Number(item.id))}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Empty State */}
                        {!questionsLoading && questions.length === 0 && !isAdding && (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                                <FontAwesomeIcon
                                    icon={icons.icon.questionCircle}
                                    className="text-3xl mb-3 text-blue-400"
                                />
                                <p className="text-sm font-medium">No common questions yet</p>
                                <p className="text-xs">Click “Add Question” to get started</p>
                            </div>
                        )}
                        {questionsLoading ||
                            (isLoading && (
                                <div className="text-center text-black py-8">
                                    {/* <span className="loading loading-spinner loading-md">Loading</span> */}
                                    <ReactLoading type={'spin'} color={'#000000'} height={32} width={32} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatasetManagementTabs;
