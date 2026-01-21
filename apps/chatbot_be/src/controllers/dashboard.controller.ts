import { Request, Response } from 'express';
import {
    getCommonQuestionsService,
    getQuestionsService,
    toggleCommonQuestionService,
    addNewQuestionService,
    deleteQuestionService,
    editQuestionService,
    mostCommonTypeQuestions,
    questionTypesMonthlyReport,
    usageChatBot,
    userInteractions,
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
        const { questionId } = request.body;

        if (questionId) {
            const result = await toggleCommonQuestionService(parseInt(questionId));
            return response.status(result.status).json({
                newQuestionList: result.newQuestionList,
                status: true,
                commonQuestions: result.commonQuestions,
            });
        } else {
            return response.status(400).json({ message: 'questionId parameter is missing' });
        }
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

export const addNewQuestionController = async (request: Request, response: Response) => {
    try {
        const { id, question, answer, category } = request.body;
        const message = await addNewQuestionService(id, question, answer, category);
        return response.status(200).json({ message: message });
    } catch (error) {
        return { status: 500, message: 'Error adding new question' };
    }
};

export const deleteQuestionController = async (request: Request, response: Response) => {
    try {
        const { questionId } = request.body;
        const message = await deleteQuestionService(parseInt(questionId));
        return response.status(200).json({ message: message });
    } catch (error) {
        return { status: 500, message: 'Error deleting question' };
    }
};

export const editQuestionController = async (request: Request, response: Response) => {
    try {
        const { id, question, answer, category } = request.body;
        const message = await editQuestionService(id, question, answer, category);
        return response.status(200).json({ message: message });
    } catch (error) {
        return { status: 500, message: 'Error editing question' };
    }
};

export const questionTypesMonthlyReportController = async (request: Request, response: Response) => {
    try {
        const { month, year } = request.body;
        const report = await questionTypesMonthlyReport(year, month);
        return response.status(200).json({ report: report.data?.data });
    } catch (error) {
        return { status: 500, message: 'Error fetching question types monthly report' };
    }
};

export const usageChatBotController = async (request: Request, response: Response) => {
    try {
        const { month, year } = request.body;
        const usageData = await usageChatBot(year, month);
        return response.status(200).json({ usageData: usageData.data });
    } catch (error) {
        return { status: 500, message: 'Error fetching usage data' };
    }
};

export const mostCommonTypeQuestionsController = async (request: Request, response: Response) => {
    try {
        const { month, year } = request.body;
        const result = await mostCommonTypeQuestions(year, month);
        return response.status(200).json({ mostCommonTypeQuestions: result.data });
    } catch (error) {
        return { status: 500, message: 'Error fetching most common type questions' };
    }
};

export const userInteractionsController = async (request: Request, response: Response) => {
    try {
        const result = await userInteractions();
        return response.status(200).json({ userInteractions: result.data });
    } catch (error) {
        return { status: 500, message: 'Error fetching user interactions' };
    }
};
