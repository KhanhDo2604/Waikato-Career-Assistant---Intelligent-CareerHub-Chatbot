import { Request, Response } from 'express';
import { getCommonQuestions, handleQuestion } from '../services/chatbot.service.js';

export const handleQuestionController = async (request: Request, response: Response) => {
    try {
        const { question } = request.body;

        if (!question || !question.trim()) {
            return response.status(400).json({
                message: 'Question is required',
            });
        }

        const userSession = (request as any).anonSid;

        const answer = await handleQuestion(userSession, question);

        return response.status(200).json({ answer: answer });
    } catch (error: Error | any) {
        return response.status(500).json({ message: error?.message || 'Internal server error' });
    }
};

export const getCommonQuestionsController = async (request: Request, response: Response) => {
    try {
        const questions = await getCommonQuestions();
        return response.status(200).json({ questions: questions });
    } catch (error: Error | any) {
        return { status: 500, message: error.message };
    }
};
