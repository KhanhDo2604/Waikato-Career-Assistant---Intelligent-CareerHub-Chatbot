import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CategoryDropdown } from './CategoryDropdown';
import type { Question } from '../../../constants/type/type';
import icons from '../../../constants/icons';

interface QuestionFormProps {
    mode: 'add' | 'edit';
    initialData?: Question;
    onSubmit: (question: Partial<Question>) => void;
    onCancel: () => void;
}

export function QuestionForm({ mode, initialData, onSubmit, onCancel }: QuestionFormProps) {
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
            question: question.trim(),
            answer: answer.trim(),
            category,
            common: true,
        });

        // Reset form if adding
        if (mode === 'add') {
            setQuestion('');
            setAnswer('');
            setCategory('');
        }
    };

    const bgColor = mode === 'add' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200';

    return (
        <div className={`p-4 border rounded-lg space-y-3 ${bgColor}`}>
            <input
                type="text"
                placeholder="Enter question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input input-sm lg:input-md input-bordered w-full bg-white"
            />

            <textarea
                placeholder="Enter answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="textarea textarea-sm lg:textarea-md textarea-bordered w-full bg-white"
                rows={3}
            />

            <CategoryDropdown value={category} onChange={setCategory} placeholder="Choose category" />

            <div className="flex gap-2">
                <button onClick={handleSubmit} className="btn btn-success btn-sm gap-2 flex-1 sm:flex-none">
                    {mode === 'add' ? 'Add' : 'Save'}
                </button>
                <button onClick={onCancel} className="btn btn-ghost btn-sm gap-2 flex-1 sm:flex-none">
                    <FontAwesomeIcon icon={icons.icon.cancle} />
                    Cancel
                </button>
            </div>
        </div>
    );
}
