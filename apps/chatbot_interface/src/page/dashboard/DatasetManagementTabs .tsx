/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../constants/icons';
import { useDashboard } from '../../hooks/useDashboard';

function DatasetManagementTabs() {
    const { dashboardState } = useDashboard();
    const { questions, questionsLoading, commonQuestions } = dashboardState;
    // Edit states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editQuestion, setEditQuestion] = useState('');

    // Add states
    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    // const [newAnswer, setNewAnswer] = useState('');

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
                        {questions.map((item) => (
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
                                            <button onClick={() => {}} className="btn btn-success btn-sm gap-2">
                                                Save
                                            </button>
                                            <button onClick={() => {}} className="btn btn-ghost btn-sm gap-2">
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
                                                onClick={() => {}}
                                                className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-800"
                                            >
                                                <FontAwesomeIcon icon={icons.icon.edit} />
                                            </button>
                                            <button
                                                onClick={() => {}}
                                                className="btn btn-ghost btn-xs text-red-600 hover:text-red-800"
                                            >
                                                <FontAwesomeIcon icon={icons.icon.bin} />
                                            </button>
                                        </div>
                                    </div>
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
