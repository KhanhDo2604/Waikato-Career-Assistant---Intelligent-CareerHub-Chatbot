import { Router } from 'express';
import {
    getCommonAnswerController,
    getCommonQuestionsController,
    handleQuestionController,
} from '../controllers/chatbot.controller.js';

const chatbotRoute = Router();

//Place to call controller functions
chatbotRoute.post('/get-chat', handleQuestionController);

chatbotRoute.get('/get-common-answer', getCommonAnswerController);

chatbotRoute.get('/get-common-questions', getCommonQuestionsController);

export default chatbotRoute;
