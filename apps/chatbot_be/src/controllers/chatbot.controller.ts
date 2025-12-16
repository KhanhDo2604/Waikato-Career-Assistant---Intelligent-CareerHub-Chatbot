import { Request, Response } from 'express';
import { getCommonAnswer, getCommonQuestions, handleQuestion } from '../services/chatbot.service.js';

export const handleQuestionController = async (request: Request, response: Response) => {
    try {
        const { question } = request.body;

        if (!question || !question.trim()) {
            return response.status(400).json({
                message: 'Question is required',
            });
        }

        // const annonSid = (request as any).anonSid;

        const answer = await handleQuestion(question);

        return response.status(answer.status).json({ answer: answer.answer });
    } catch (error: Error | any) {
        return response.status(500).json({ message: error?.message || 'Internal server error' });
    }
};

export const getCommonAnswerController = async (request: Request, response: Response) => {
    try {
        const { questionId } = request.body;

        if (!questionId) {
            return response.status(400).json({
                message: 'Question ID is required',
            });
        }

        const answer = await getCommonAnswer(questionId);

        return response.status(answer.status).json(answer.answer);
    } catch (error: Error | any) {
        return { status: 500, message: error.message };
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
