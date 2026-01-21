import http from '../api/http';
import type { Question } from '../constants/type/type';

export const getQuestionsFromDB = async (): Promise<Question[]> => {
    try {
        const res = await http.get('/api/dashboard/questions');

        return res.data.questions.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getCommonQuestions = async (): Promise<Question[]> => {
    try {
        const res = await http.get('/api/dashboard/get-common-questions');

        return res.data.commonQuestions;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error);
    }
};

export const toggleCommonQuestion = async (
    questionId: number,
): Promise<{ status: boolean; newQuestionList: Question[]; commonQuestions: Question[] }> => {
    try {
        const res = await http.post('/api/dashboard/toggle-common-question', { questionId });

        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error);
    }
};

export const addNewQuestion = async (question: Question) => {
    try {
        const res = await http.post('/api/dashboard/add-new-question', question);

        return res.data.message;
    } catch (error) {
        throw new Error('Error adding new question', { cause: error });
    }
};

export const deleteQuestion = async (questionId: number) => {
    try {
        const res = await http.delete('/api/dashboard/delete-question', { data: { questionId } });

        return res.data.message;
    } catch (error) {
        throw new Error('Error deleting question', { cause: error });
    }
};

export const editQuestion = async (question: Question) => {
    try {
        const res = await http.put('/api/dashboard/edit-question', question);

        return res.data.message;
    } catch (error) {
        throw new Error('Error editing question', { cause: error });
    }
};
