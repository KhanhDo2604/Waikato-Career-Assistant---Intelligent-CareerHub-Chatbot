import { askChatbot } from '../../api/http.js';
import { commonQuestions } from '../../data/mockData.js';
import { AskError } from '../models/type.js';

// Place to handle chatbot logics

export const handleQuestion = async (userSession: string, question: string) => {
    try {
        const payload = { user_id: userSession, question };

        const data = await askChatbot(payload, '/chat/ask', 'POST');

        return data;
    } catch (error: any) {
        const err = error as AskError;
        return { status: err.status || 500, message: `handleQuestion BE: ${err.message}` };
    }
};

export const getCommonQuestions = async () => {
    try {
        const questions = commonQuestions; //query from database

        return questions;
    } catch (error: Error | any) {
        const err = error as AskError;
        return { status: err.status || 500, message: `getCommonQuestions BE: ${err.message}` };
    }
};
