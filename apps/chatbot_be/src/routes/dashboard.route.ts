import { Router } from 'express';
import {
    addNewQuestionController,
    deleteQuestionController,
    editQuestionController,
    getCommonQuestionsController,
    getQuestionsFromDBController,
    mostCommonTypeQuestionsController,
    questionTypesMonthlyReportController,
    toggleCommonQuestionController,
    usageChatBotController,
    userInteractionsController,
} from '../controllers/dashboard.controller.js';

const dashboardRoute = Router();

dashboardRoute.get('/questions', getQuestionsFromDBController);

dashboardRoute.get('/get-common-questions', getCommonQuestionsController);

dashboardRoute.post('/toggle', toggleCommonQuestionController);

dashboardRoute.post('/question', addNewQuestionController);

dashboardRoute.delete('/question', deleteQuestionController);

dashboardRoute.put('/question', editQuestionController);

dashboardRoute.get('/get-questions-type', questionTypesMonthlyReportController);

dashboardRoute.get('/get-usage', usageChatBotController);

dashboardRoute.get('/most-common-type-questions', mostCommonTypeQuestionsController);

dashboardRoute.get('/user-interactions', userInteractionsController);

export default dashboardRoute;
