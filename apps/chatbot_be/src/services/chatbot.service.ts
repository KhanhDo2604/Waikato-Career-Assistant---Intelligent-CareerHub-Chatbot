import { askChatbot } from '../../api/http.js';
import { commonQuestions } from '../../data/mockData.js';
import { AskError } from '../models/type.js';

// Place to handle chatbot logics

export const handleQuestion = async (question: string) => {
    try {
        const data = await askChatbot(question, '', 'POST');

        return {
            status: 200,
            answer: data.answer,
        };
    } catch (error: any) {
        const err = error as AskError;
        return { status: err.status || 500, message: err.message };
    }
};

export const getCommonAnswer = async (questionId: string) => {
    try {
        // Query databbase to get common answer
        const answer = commonQuestions.find((q) => q.id.toString() === questionId);

        return {
            status: 200,
            answer: answer?.answer,
        };
    } catch (error: Error | any) {
        const err = error as AskError;
        return { status: err.status || 500, message: err.message };
    }
};

export const getCommonQuestions = async () => {
    try {
        const questions = commonQuestions; //query from database

        return questions;
    } catch (error: Error | any) {
        const err = error as AskError;
        return { status: err.status || 500, message: err.message };
    }
};
