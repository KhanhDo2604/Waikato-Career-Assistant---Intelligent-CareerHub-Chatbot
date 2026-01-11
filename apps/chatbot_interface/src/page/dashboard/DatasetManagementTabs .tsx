import { useState } from 'react';
import type { Question } from '../../constants/type/chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../constants/icons';

function DatasetManagementTabs() {
    // const [activeTab, setActiveTab] = useState<'dataset' | 'common'>('dataset');
    // Edit states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editQuestion, setEditQuestion] = useState('');
    // const [editAnswer, setEditAnswer] = useState('');

    // Add states
    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    // Common questions state (from context)
    const [commonQuestions, setCommonQuestions] = useState<Question[]>([]);

    // Common Questions CRUD functions
    const handleAddCommon = () => {
        if (!newQuestion.trim()) return;

        const newItem: Question = {
            id: Date.now().toString(),
            question: newQuestion.trim(),
            answer: newAnswer.trim(),
        };

        setCommonQuestions([...commonQuestions, newItem]);
        setNewQuestion('');
        setIsAdding(false);
    };

    const handleEditCommon = (item: Question) => {
        setEditingId(item.id);
        setEditQuestion(item.question);
        // setEditAnswer(item.answer);
    };

    const handleSaveCommon = () => {
        if (!editQuestion.trim()) return;

        setCommonQuestions(
            commonQuestions.map((item) => (item.id === editingId ? { ...item, question: editQuestion.trim() } : item)),
        );
        setEditingId(null);
        setEditQuestion('');
        // setEditAnswer('');
    };

    const handleDeleteCommon = (id: string) => {
        if (confirm('Are you sure you want to delete this question?')) {
            setCommonQuestions(commonQuestions.filter((item) => item.id !== id));
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setEditQuestion('');
        // setEditAnswer('');
        setNewQuestion('');
        setNewAnswer('');
    };

    return (
        <div className="card bg-white shadow-sm">
            <div className="card-body p-4">
                <h2 className="card-title text-xl mb-4">Dataset & Questions Management</h2>

                {/* Content */}
                <div className="min-h-[300px] max-h-[400px] overflow-y-auto">
                    <div className="space-y-3">
                        {/* Add button */}
                        {!isAdding && (
                            <button onClick={() => setIsAdding(true)} className="btn btn-sm btn-primary gap-2 mb-2">
                                {/* <Plus size={16} /> */}
                                <FontAwesomeIcon icon={icons.icon.plus} />
                                Add Common Question
                            </button>
                        )}

                        {/* Add form */}
                        {isAdding && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                                <input
                                    type="text"
                                    placeholder="Enter common question..."
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    className="input input-bordered w-full"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAddCommon} className="btn btn-success btn-sm gap-2">
                                        Save
                                    </button>
                                    <button onClick={handleCancel} className="btn btn-ghost btn-sm gap-2">
                                        <FontAwesomeIcon icon={icons.icon.cancle} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Common questions list */}
                        {commonQuestions.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                            >
                                {editingId === item.id ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={editQuestion}
                                            onChange={(e) => setEditQuestion(e.target.value)}
                                            className="input input-bordered w-full"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveCommon} className="btn btn-success btn-sm gap-2">
                                                Save
                                            </button>
                                            <button onClick={handleCancel} className="btn btn-ghost btn-sm gap-2">
                                                <FontAwesomeIcon icon={icons.icon.cancle} />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-800">{item.question}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditCommon(item)}
                                                className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon icon={icons.icon.edit} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCommon(item.id)}
                                                className="btn btn-ghost btn-xs text-red-600 hover:text-red-800"
                                            >
                                                <FontAwesomeIcon icon={icons.icon.bin} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {commonQuestions.length === 0 && !isAdding && (
                            <p className="text-center text-gray-400 py-8">
                                No common questions yet. Click "Add Common Question" to get started.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DatasetManagementTabs;
