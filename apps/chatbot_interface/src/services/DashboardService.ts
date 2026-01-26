import http from '../api/http';
import type { Interaction, MonthlyUserCount, Question, QuestionTypeCount } from '../constants/type/type';

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

export const addNewQuestion = async (question: Question): Promise<Question> => {
    try {
        const res = await http.post('/api/dashboard/question', question);

        if (res.status === 200) {
            return res.data;
        }
        throw new Error('Failed to add new question');
    } catch (error) {
        throw new Error('Error adding new question', { cause: error });
    }
};

export const deleteQuestion = async (questionId: number) => {
    try {
        const res = await http.delete('/api/dashboard/question', { data: { questionId } });

        if (res.status === 200) {
            return res.data.message;
        }
        throw new Error('Failed to delete question');
    } catch (error) {
        throw new Error('Error deleting question', { cause: error });
    }
};

export const editQuestion = async (question: Question): Promise<Question> => {
    try {
        const res = await http.put('/api/dashboard/question', question);
        if (res.status === 200) {
            return res.data;
        }
        throw new Error('Failed to edit question');
    } catch (error) {
        throw new Error('Error editing question', { cause: error });
    }
};

export const getQuestionTypesMonthlyReport = async (year: number, month: number): Promise<QuestionTypeCount[]> => {
    try {
        const res = await http.get('/api/dashboard/get-questions-type', {
            params: { year, month },
        });

        return res.data.report;
    } catch (error) {
        throw new Error('Error fetching question types monthly report', { cause: error });
    }
};

export const getUsageChatBot = async (year: number, month: number): Promise<MonthlyUserCount[]> => {
    try {
        const res = await http.get('/api/dashboard/get-usage', { params: { year, month } });

        return res.data.usageData;
    } catch (error) {
        throw new Error('Error fetching usage data', { cause: error });
    }
};

export const getMostCommonTypeQuestions = async (year: number, month: number) => {
    try {
        const res = await http.get('/api/dashboard/most-common-type-questions', {
            params: { year, month },
        });

        return res.data.mostCommonTypeQuestions;
    } catch (error) {
        throw new Error('Error fetching most common type questions', { cause: error });
    }
};

export const getUserInteractions = async (): Promise<Interaction[]> => {
    try {
        const res = await http.get('/api/dashboard/user-interactions');

        return res.data.userInteractions;
    } catch (error) {
        throw new Error('Error fetching user interactions', { cause: error });
    }
};
