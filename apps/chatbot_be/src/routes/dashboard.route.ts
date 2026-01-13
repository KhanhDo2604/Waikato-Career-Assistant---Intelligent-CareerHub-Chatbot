import { Router } from 'express';
import {
    getCommonQuestionsController,
    getQuestionsFromDBController,
    toggleCommonQuestionController,
} from '../controllers/dashboard.controller.js';

const dashboardRoute = Router();

dashboardRoute.get('/questions', getQuestionsFromDBController);

dashboardRoute.get('/get-common-questions', getCommonQuestionsController);

dashboardRoute.post('/toggle', toggleCommonQuestionController);

export default dashboardRoute;
