import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CategoryDropdown } from './CategoryDropdown';
import type { Question } from '../../../constants/type/type';
import icons from '../../../constants/icons';
import { useDashboard } from '../../../hooks/useDashboard';

interface QuestionFormProps {
    mode: 'add' | 'edit';
    initialData?: Question;
    onSubmit: (question: Partial<Question>) => void;
    onCancel: () => void;
}

export function QuestionForm({ mode, initialData, onSubmit, onCancel }: QuestionFormProps) {
    const { dashboardState } = useDashboard();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('');

    // Initialize form with data when editing
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuestion(initialData.question ? initialData.question : '');
            setAnswer(initialData.answer);
            setCategory(initialData.category ? initialData.category : '');
        }
    }, [mode, initialData]);

    const handleSubmit = () => {
        if (!question.trim() || !answer.trim() || !category) {
            alert('Please fill in all fields');
            return;
        }

        onSubmit({
            id: mode === 'edit' ? Number(initialData?.id) : dashboardState.questions.length + 1,
            question: question.trim(),
            answer: answer.trim(),
            category,
            common: mode === 'edit' ? initialData?.common : false,
        });

        // Reset form if adding
        if (mode === 'add') {
            setQuestion('');
            setAnswer('');
            setCategory('');
        }
    };

    return (
        <div
            className={[
                'rounded-2xl border bg-white shadow-sm',
                'p-4 lg:p-5',
                mode === 'add' ? 'border-primary-200' : 'border-amber-200',
            ].join(' ')}
        >
            {/* Top header */}
            <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="flex flex-col items-start gap-3">
                    <div className="flex justify-between w-full">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                            {mode === 'add' ? 'Add a Common Question' : 'Edit Common Question'}
                        </h3>
                        <span
                            className={['badge badge-sm', mode === 'add' ? 'badge-primary' : 'badge-warning'].join(' ')}
                        >
                            {mode === 'add' ? 'New' : 'Editing'}
                        </span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500">
                        Provide a question, an answer, and choose the most relevant category to include in the chatbot.
                    </p>
                </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
                {/* Question */}
                <div>
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">Question</label>

                    <input
                        type="text"
                        placeholder="e.g., How do I write a strong CV?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className={[
                            'w-full rounded-xl border px-4 py-3 text-sm lg:text-base',
                            'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300',
                            'transition',
                        ].join(' ')}
                    />
                </div>

                {/* Answer */}
                <div>
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">Answer</label>

                    <textarea
                        placeholder="Write an answer to add in the chatbot"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className={[
                            'w-full rounded-xl border px-4 py-3 text-sm lg:text-base',
                            'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300',
                            'transition min-h-[120px]',
                        ].join(' ')}
                    />
                </div>

                {/* Category */}
                <div className="pt-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">Category</label>

                    {/* Keep your existing component */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 focus-within:ring-2 focus-within:ring-blue-200">
                        <CategoryDropdown value={category} onChange={setCategory} placeholder="Choose category" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-sm sm:btn-md btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 gap-2"
                    >
                        <FontAwesomeIcon icon={icons.icon.cancle} />
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className={[
                            'btn btn-sm sm:btn-md gap-2',
                            mode === 'add' ? 'btn-primary' : 'btn-warning',
                            'shadow-sm',
                        ].join(' ')}
                    >
                        {mode === 'add' ? 'Add Question' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
