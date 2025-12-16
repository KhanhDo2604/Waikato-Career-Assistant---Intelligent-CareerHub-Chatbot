import http from '../api/http';
import type { Question } from '../constants/type/chat';

export const getAnswer = async (question: string): Promise<string> => {
    const trimmed = question.trim();
    if (!trimmed) {
        throw new Error('Question is required');
    }
    const res = await http.post('/api/chatbot/get-chat', {
        question: trimmed,
    });

    return res.data.answer;
};

export const getCommonQuestions = async (): Promise<Question[]> => {
    const res = await http.get('/api/chatbot/get-common-questions');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.data.questions.map((item: any) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        category: item.category,
    }));
};
