import { interactModel } from '../../api/http.js';
import { AskError } from '../models/type.js';

// Place to handle chatbot logics

export const handleQuestion = async (userSession: string, question: string) => {
    try {
        const payload = { user_id: userSession, question };

        const data = await interactModel(payload, '/chat/ask', 'POST');

        //gọi model để xác định category của question
        //Lưu data vào database

        return data;
    } catch (error: any) {
        const err = error as AskError;
        return { status: err.status || 500, message: `handleQuestion BE: ${err.message}` };
    }
};
