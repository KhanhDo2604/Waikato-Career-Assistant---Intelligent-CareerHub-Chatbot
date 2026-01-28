import { useState } from 'react';
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

    const [questionsText, setQuestionsText] = useState(
        mode === 'edit' && initialData ? (initialData.questions ?? []).join('\n') : '',
    );
    const [answer, setAnswer] = useState(mode === 'edit' && initialData ? initialData.answer : '');
    const [category, setCategory] = useState(mode === 'edit' && initialData ? initialData.category : '');

    const handleSubmit = () => {
        const questions = questionsText
            .split('\n')
            .map((q) => q.trim())
            .filter(Boolean);

        if (!questions.length || !answer.trim() || !category) {
            alert('Please fill in all fields');
            return;
        }

        onSubmit({
            id: mode === 'edit' ? Number(initialData?.id) : dashboardState.questions.length + 1,
            questions,
            answer: answer.trim(),
            category,
            common: mode === 'edit' ? initialData?.common : false,
        });

        if (mode === 'add') {
            setQuestionsText('');
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
            {/* Header giữ nguyên */}

            <div className="space-y-4">
                {/* Questions */}
                <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Questions (one per line)</label>

                    <textarea
                        value={questionsText}
                        onChange={(e) => setQuestionsText(e.target.value)}
                        placeholder="Enter one question per line"
                        className="w-full rounded-xl border px-4 py-3 text-sm min-h-[140px] bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
                    />
                </div>

                {/* Answer */}
                <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Answer</label>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full rounded-xl border px-4 py-3 text-sm min-h-[120px] bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
                    />
                </div>

                {/* Category giữ nguyên */}
                <div className="pt-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">Category</label>

                    {/* Keep your existing component */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 focus-within:ring-2 focus-within:ring-blue-200">
                        <CategoryDropdown value={category} onChange={setCategory} placeholder="Choose category" />
                    </div>
                </div>
            </div>

            {/* Actions giữ nguyên */}
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
    );
}
