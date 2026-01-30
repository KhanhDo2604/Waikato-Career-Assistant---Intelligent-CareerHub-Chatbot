import { promises as fs } from 'fs';
import path from 'path';

import { Question } from '../models/type';
import { fileURLToPath } from 'url';

import { interactModel } from '../../api/http.js';
import connectToMongoDB from '../db.js';

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
    } catch (error: any) {
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
    } catch (error: any) {
        return { status: 500, message: `toggleCommonQuestionService: ${error.message}` };
    }
};

export const getCommonQuestionsService = async () => {
    try {
        const questions = await readQAFile();
        console.log(questions);

        const commonQuestions = questions.filter((q) => q.common);
        return commonQuestions;
    } catch (error: any) {
        return { status: 500, message: `getCommonQuestionsService: ${error.message}` };
    }
};

export const addNewQuestionService = async (id: number, questions: string[], answer: string, category: string) => {
    try {
        const payload = { id, questions, answer, category, common: false };
        const data = await interactModel(payload, '/chat/add', 'POST');

        return data.new_question;
    } catch (error) {
        console.error('Error adding new question:', error);
        return { status: 500, message: 'Error adding new question' };
    }
};

export const deleteQuestionService = async (questionId: number) => {
    try {
        const payload = { id: questionId };

        const data = await interactModel(payload, '/chat/del', 'DELETE');

        return data;
    } catch (error) {
        console.error('Error deleting question:', error);
        return { status: 500, message: 'Error deleting question' };
    }
};

export const editQuestionService = async (
    questionId: number,
    newQuestion: string[],
    newAnswer: string,
    newCategory: string,
    common: boolean,
) => {
    try {
        const payload = { id: questionId, questions: newQuestion, answer: newAnswer, category: newCategory, common };

        const data = await interactModel(payload, '/chat/update_qa', 'PUT');

        return data.new_question;
    } catch (error) {
        console.log('Error editing question:', error);
        return { status: 500, message: 'Error editing question' };
    }
};

const normalizeMonthIndex = (month?: number) => {
    if (month === undefined || month === null) return undefined;

    if (month >= 1 && month <= 12) return month - 1;
    if (month >= 0 && month <= 11) return month;

    throw new Error('month must be between 1-12 (or 0-11 if zero-based)');
};

function buildDateConstraints(year: number, month?: number) {
    const timezone = 'Pacific/Auckland';

    if (month !== undefined) {
        return {
            createdAt: {
                $gte: new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00+13:00`),
                $lt: new Date(`${year}-${String(month + 1).padStart(2, '0')}-01T00:00:00+13:00`),
            },
        };
    }

    return {
        createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00+13:00`),
            $lt: new Date(`${year + 1}-01-01T00:00:00+13:00`),
        },
    };
}

/**
 * Count how many question types in a particular month (Firestore version)
 */
export const questionTypesMonthlyReport = async (year?: number, month?: number) => {
    try {
        if (!year) return { status: 400, message: 'year is required' };

        const collection = await connectToMongoDB('interactions');
        const dateConstraints = buildDateConstraints(year, month);

        const interactions = await collection.find(dateConstraints).toArray();

        const result: Record<string, number> = {};

        interactions.forEach((doc) => {
            const category = doc.category || 'General';
            result[category] = (result[category] || 0) + 1;
        });

        return { status: 200, data: result };
    } catch (error: any) {
        return { status: 500, message: `questionTypesMonthlyReport: ${error.message}` };
    }
};

/**
 * Count how many users use chatbot in a particular period
 */
export const usageChatBot = async (year?: number, month?: number) => {
    try {
        if (!year) return { status: 400, message: 'year is required' };

        const collection = await connectToMongoDB('interactions');
        const dateConstraints = buildDateConstraints(year, month);

        if (!collection) {
            throw new Error('MongoDB collection not initialized');
        }
        const result = await collection
            .aggregate([
                { $match: dateConstraints },
                {
                    $group: {
                        _id: {
                            year: {
                                $year: { date: '$createdAt', timezone: 'Pacific/Auckland' },
                            },
                            month: {
                                $month: { date: '$createdAt', timezone: 'Pacific/Auckland' },
                            },
                            day: {
                                $dayOfMonth: { date: '$createdAt', timezone: 'Pacific/Auckland' },
                            },
                        },
                        uniqueUsers: {
                            $addToSet: '$anonSid',
                        },
                        totalInteractions: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: '$_id.day',
                            },
                        },
                        day: '$_id.day',
                        uniqueUsers: {
                            $size: {
                                $filter: {
                                    input: '$uniqueUsers',
                                    cond: { $ne: ['$$this', null] },
                                },
                            },
                        },
                        totalInteractions: 1,
                    },
                },
                { $sort: { date: 1 } },
            ])
            .toArray();

        // Format dates as strings
        const formattedResult = result.map((item) => ({
            day: item.day,
            uniqueUsers: item.uniqueUsers,
            totalInteractions: item.totalInteractions,
        }));

        return {
            status: 200,
            data: formattedResult,
        };
    } catch (error: any) {
        console.error('Error in usageChatBot:', error);
        return { status: 500, message: `usageChatBot: ${error.message}` };
    }
};

/**
 * Get MOST COMMON QUESTIONS in a particular month
 */
export const mostCommonTypeQuestions = async (year?: number, month?: number, top = 5) => {
    try {
        if (!year) return { status: 400, message: 'year is required' };

        const collection = await connectToMongoDB('interactions');
        const dateConstraints = buildDateConstraints(year, month);

        const interactions = await collection.find(dateConstraints).toArray();

        const counter: Record<string, number> = {};

        interactions.forEach((doc) => {
            const questionKey = (doc.question || '').trim() || 'Unknown';
            counter[questionKey] = (counter[questionKey] || 0) + 1;
        });

        const data = Object.entries(counter)
            .map(([question, count]) => ({ question, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, top);

        return { status: 200, data };
    } catch (error: any) {
        return { status: 500, message: `mostCommonTypeQuestions: ${error.message}` };
    }
};

/**
 * Get Recent User Interactions (question and Date)
 */
export const userInteractions = async (year?: number, month?: number, limit = 5) => {
    try {
        if (!year) return { status: 400, message: 'year is required' };

        const collection = await connectToMongoDB('interactions');

        const dateConstraints = buildDateConstraints(year, month);

        const interactions = await collection
            .find({
                createdAt: {
                    ...dateConstraints.createdAt,
                    $exists: true,
                    $type: 'date',
                },
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .toArray();

        const data = interactions.map((doc) => ({
            id: doc._id?.toString() || '',
            question: doc.question || '',
            createdAt: doc.createdAt ?? '',
            category: doc.category || 'General',
        }));

        return { status: 200, data };
    } catch (error: any) {
        return { status: 500, message: `userInteractions: ${error.message}` };
    }
};

/**
 * Update FAQ dataset (Firestore version)
 */
// export const updateDataset = async (dataset: FaqItem[]) => {
//     try {
//         if (!Array.isArray(dataset) || dataset.length === 0) {
//             return { status: 400, message: 'dataset is required' };
//         }

//         const faqCollection = collection(database, 'common_questions');
//         let updated = 0;

//         for (const item of dataset) {
//             if (!item?.question?.trim() || !item?.answer?.trim()) {
//                 return { status: 400, message: 'question and answer are required for each FAQ item' };
//             }

//             const payload = {
//                 question: item.question.trim(),
//                 answer: item.answer.trim(),
//                 category: item.category || 'General',
//                 isActive: item.isActive ?? true,
//                 updatedAt: Timestamp.now(),
//             };

//             if (item.id) {
//                 await updateDoc(doc(faqCollection, item.id), payload);
//             } else {
//                 await addDoc(faqCollection, { ...payload, createdAt: Timestamp.now() });
//             }

//             updated += 1;
//         }

//         return { status: 200, updated };
//     } catch (error: any) {
//         return { status: 500, message: `updateDataset: ${error.message}` };
//     }
// };
