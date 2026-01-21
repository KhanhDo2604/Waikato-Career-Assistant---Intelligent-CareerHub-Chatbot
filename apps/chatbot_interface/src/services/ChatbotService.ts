import http from '../api/http';

export const getAnswer = async (question: string): Promise<string> => {
    try {
        const trimmed = question.trim();
        if (!trimmed) {
            throw new Error('Question is required');
        }

        const res = await http.post('/api/chatbot/get-chat', {
            question: trimmed,
        });

        return res.data.answer;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error);
    }
};
