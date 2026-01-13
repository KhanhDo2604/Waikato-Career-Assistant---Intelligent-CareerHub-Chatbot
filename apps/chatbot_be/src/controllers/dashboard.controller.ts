import { Request, Response } from 'express';
import {
    getCommonQuestionsService,
    getQuestionsService,
    toggleCommonQuestionService,
} from '../services/dashboard.service';

export const getQuestionsFromDBController = async (request: Request, response: Response) => {
    try {
        const questions = await getQuestionsService();

        return response.status(200).json({ questions: questions });
    } catch (error: any | Error) {
        response.status(500).json({ message: error.message });
    }
};

export const toggleCommonQuestionController = async (request: Request, response: Response) => {
    try {
        const { questionId } = request.params;
        const result = await toggleCommonQuestionService(parseInt(questionId));
        return response
            .status(result.status)
            .json({ newQuestionList: result.newQuestionList, status: true, commonQuestions: result.commonQuestions });
    } catch (error: any | Error) {
        response.status(500).json({ message: error.message });
    }
};

export const getCommonQuestionsController = async (request: Request, response: Response) => {
    try {
        const questions = await getCommonQuestionsService();
        return response.status(200).json({ commonQuestions: questions });
    } catch (error: Error | any) {
        return { status: 500, message: error.message };
    }
};
