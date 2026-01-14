import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../constants/icons';
import { useDashboard } from '../../hooks/useDashboard';
import type { Question } from '../../constants/type/type';
import { QuestionForm } from './components/QuestionForm';
import { QuestionItem } from './components/QuestionItem';

function DatasetManagementTabs() {
    const { dashboardState, dashboardActions } = useDashboard();
    const { questions, questionsLoading } = dashboardState;
    // Edit states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    // Add states
    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    // const [newAnswer, setNewAnswer] = useState('');

    const handleAddQuestion = async (questionData: Partial<Question>) => {
        // try {
        //     await dashboardActions.addQuestion(questionData);
        //     setIsAdding(false);
        // } catch (error) {
        //     console.error('Error adding question:', error);
        // }
    };

    const handleEditQuestion = async (id: number, questionData: Partial<Question>) => {
        // try {
        //     await dashboardActions.updateQuestion(id, questionData);
        //     setEditingId(null);
        //     setEditingQuestion(null);
        // } catch (error) {
        //     console.error('Error updating question:', error);
        // }
    };

    const handleDeleteQuestion = async (id: number) => {
        // if (confirm('Are you sure you want to delete this question?')) {
        //     try {
        //         await dashboardActions.deleteQuestion(id);
        //     } catch (error) {
        //         console.error('Error deleting question:', error);
        //     }
        // }
    };

    const handleStartEdit = (question: Question) => {
        // setEditingId(question.id);
        // setEditingQuestion(question);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingQuestion(null);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    return (
        <div className="card bg-white shadow-sm">
            <div className="card-body p-4">
                <h2 className="card-title text-xl mb-2">Dataset & Questions Management</h2>
                {/* Add button */}
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="btn btn-sm btn-primary gap-2 mb-2 shadow-none">
                        <FontAwesomeIcon icon={icons.icon.plus} />
                        Add Common Question
                    </button>
                )}
                {/* Content */}
                <div className="h-80 overflow-y-auto">
                    <div className="space-y-3">
                        {/* Add form */}
                        {isAdding && (
                            <QuestionForm mode="add" onSubmit={handleAddQuestion} onCancel={handleCancelAdd} />
                        )}

                        {/* Common questions list */}
                        {questions.map((item) => (
                            <div key={item.id}>
                                {editingId === item.id && editingQuestion ? (
                                    <QuestionForm
                                        mode="edit"
                                        initialData={editingQuestion}
                                        onSubmit={(data) => handleEditQuestion(item.id, data)}
                                        onCancel={handleCancelEdit}
                                    />
                                ) : (
                                    <QuestionItem
                                        question={item}
                                        onEdit={() => handleStartEdit(item)}
                                        onDelete={() => handleDeleteQuestion(item.id)}
                                    />
                                )}
                            </div>
                        ))}

                        {questions.length === 0 && !isAdding && !questionsLoading && (
                            <p className="text-center text-gray-400 py-8">
                                No common questions yet. Click "Add Common Question" to get started.
                            </p>
                        )}
                        {questionsLoading && (
                            <div className="text-center text-black py-8">
                                <span className="loading loading-spinner loading-md">Loading</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatasetManagementTabs;
