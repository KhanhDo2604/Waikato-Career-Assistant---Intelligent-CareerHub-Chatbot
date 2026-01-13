import { promises as fs } from 'fs';
import path from 'path';

import { Question } from '../models/type';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, '../../../../AI_server/background_docs/QA_list.json');

export async function readQAFile(): Promise<Question[]> {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');

    return JSON.parse(raw);
}

export const getQuestionsService = async () => {
    try {
        const questions = await readQAFile();
        return { status: 200, data: questions };
    } catch (error) {
        return { status: 500, message: `getQuestionsService: ${error.message}` };
    }
};

export const toggleCommonQuestionService = async (questionId: number) => {
    try {
        const questions = await readQAFile();
        const updatedQuestions = questions.map((q) =>
            q.id === questionId.toString() ? { ...q, common: !q.common } : q,
        );

        await fs.writeFile(DATA_PATH, JSON.stringify(updatedQuestions, null, 2), 'utf-8');
        return {
            status: 200,
            newQuestionList: updatedQuestions,
            commonQuestions: updatedQuestions.filter((q) => q.common),
        };
    } catch (error) {
        return { status: 500, message: `toggleCommonQuestionService: ${error.message}` };
    }
};

export const getCommonQuestionsService = async () => {
    try {
        const questions = await readQAFile();
        const commonQuestions = questions.filter((q) => q.common);
        return commonQuestions;
    } catch (error) {
        return { status: 500, message: `getCommonQuestionsService: ${error.message}` };
    }
};
