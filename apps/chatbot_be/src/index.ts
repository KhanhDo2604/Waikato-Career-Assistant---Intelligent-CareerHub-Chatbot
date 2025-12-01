import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = join(process.cwd(), 'data', 'interactions.json');

// Ensure data directory exists
import { mkdirSync } from 'fs';
if (!existsSync(join(process.cwd(), 'data'))) {
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
}

// Initialize data file if it doesn't exist
if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify({ interactions: [], users: [] }, null, 2));
}

interface Interaction {
    id: string;
    userId: string;
    userType: 'user' | 'alumni';
    question: string;
    answer: string;
    timestamp: string;
    questionType?: string;
}

interface User {
    id: string;
    userType: 'user' | 'alumni';
    firstInteraction: string;
    lastInteraction: string;
}

function readData(): { interactions: Interaction[]; users: User[] } {
    try {
        const data = readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { interactions: [], users: [] };
    }
}

function writeData(data: { interactions: Interaction[]; users: User[] }) {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Categorize question type based on keywords
function categorizeQuestion(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('career') || lowerQuestion.includes('job') || lowerQuestion.includes('employment')) {
        return 'Career';
    }
    if (lowerQuestion.includes('course') || lowerQuestion.includes('program') || lowerQuestion.includes('degree')) {
        return 'Course/Program';
    }
    if (lowerQuestion.includes('admission') || lowerQuestion.includes('apply') || lowerQuestion.includes('application')) {
        return 'Admission';
    }
    if (lowerQuestion.includes('scholarship') || lowerQuestion.includes('financial') || lowerQuestion.includes('fee')) {
        return 'Scholarship/Financial';
    }
    if (lowerQuestion.includes('campus') || lowerQuestion.includes('facility') || lowerQuestion.includes('location')) {
        return 'Campus/Facilities';
    }
    if (lowerQuestion.includes('alumni') || lowerQuestion.includes('graduate') || lowerQuestion.includes('network')) {
        return 'Alumni Network';
    }
    return 'General';
}

// Save interaction
app.post('/api/interactions', (req, res) => {
    try {
        const { userId, userType, question, answer } = req.body;
        
        if (!userId || !userType || !question || !answer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const data = readData();
        const questionType = categorizeQuestion(question);
        
        const interaction: Interaction = {
            id: Date.now().toString(),
            userId,
            userType,
            question,
            answer,
            timestamp: new Date().toISOString(),
            questionType,
        };

        data.interactions.push(interaction);

        // Update or create user
        let user = data.users.find(u => u.id === userId);
        if (!user) {
            user = {
                id: userId,
                userType,
                firstInteraction: interaction.timestamp,
                lastInteraction: interaction.timestamp,
            };
            data.users.push(user);
        } else {
            user.lastInteraction = interaction.timestamp;
        }

        writeData(data);
        res.json({ success: true, interaction });
    } catch (error) {
        console.error('Error saving interaction:', error);
        res.status(500).json({ error: 'Failed to save interaction' });
    }
});

// Get analytics - monthly question types
app.get('/api/analytics/question-types', (req, res) => {
    try {
        const data = readData();
        const { month, year } = req.query;
        
        let filteredInteractions = data.interactions;
        
        if (month && year) {
            filteredInteractions = data.interactions.filter(interaction => {
                const date = new Date(interaction.timestamp);
                return date.getMonth() === parseInt(month as string) && 
                       date.getFullYear() === parseInt(year as string);
            });
        }

        const questionTypes: Record<string, number> = {};
        filteredInteractions.forEach(interaction => {
            const type = interaction.questionType || 'General';
            questionTypes[type] = (questionTypes[type] || 0) + 1;
        });

        res.json(questionTypes);
    } catch (error) {
        console.error('Error getting question types:', error);
        res.status(500).json({ error: 'Failed to get question types' });
    }
});

// Get analytics - most common questions (monthly)
app.get('/api/analytics/common-questions', (req, res) => {
    try {
        const data = readData();
        const { month, year, limit = 10 } = req.query;
        
        let filteredInteractions = data.interactions;
        
        if (month && year) {
            filteredInteractions = data.interactions.filter(interaction => {
                const date = new Date(interaction.timestamp);
                return date.getMonth() === parseInt(month as string) && 
                       date.getFullYear() === parseInt(year as string);
            });
        }

        const questionCounts: Record<string, number> = {};
        filteredInteractions.forEach(interaction => {
            const question = interaction.question.toLowerCase().trim();
            questionCounts[question] = (questionCounts[question] || 0) + 1;
        });

        const sortedQuestions = Object.entries(questionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, parseInt(limit as string))
            .map(([question, count]) => ({ question, count }));

        res.json(sortedQuestions);
    } catch (error) {
        console.error('Error getting common questions:', error);
        res.status(500).json({ error: 'Failed to get common questions' });
    }
});

// Get analytics - monthly user counts
app.get('/api/analytics/user-counts', (req, res) => {
    try {
        const data = readData();
        const { month, year } = req.query;
        
        let filteredInteractions = data.interactions;
        
        if (month && year) {
            filteredInteractions = data.interactions.filter(interaction => {
                const date = new Date(interaction.timestamp);
                return date.getMonth() === parseInt(month as string) && 
                       date.getFullYear() === parseInt(year as string);
            });
        }

        const userCounts: Record<string, { users: number; alumni: number; total: number }> = {};
        
        filteredInteractions.forEach(interaction => {
            const date = new Date(interaction.timestamp);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!userCounts[monthKey]) {
                userCounts[monthKey] = { users: 0, alumni: 0, total: 0 };
            }
            
            if (interaction.userType === 'user') {
                userCounts[monthKey].users++;
            } else {
                userCounts[monthKey].alumni++;
            }
            userCounts[monthKey].total++;
        });

        // Get unique users per month
        const uniqueUsersPerMonth: Record<string, Set<string>> = {};
        filteredInteractions.forEach(interaction => {
            const date = new Date(interaction.timestamp);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!uniqueUsersPerMonth[monthKey]) {
                uniqueUsersPerMonth[monthKey] = new Set();
            }
            uniqueUsersPerMonth[monthKey].add(interaction.userId);
        });

        const monthlyStats = Object.entries(userCounts).map(([month, counts]) => ({
            month,
            uniqueUsers: uniqueUsersPerMonth[month]?.size || 0,
            ...counts,
        })).sort((a, b) => a.month.localeCompare(b.month));

        res.json(monthlyStats);
    } catch (error) {
        console.error('Error getting user counts:', error);
        res.status(500).json({ error: 'Failed to get user counts' });
    }
});

// Get all interactions for dashboard
app.get('/api/analytics/interactions', (req, res) => {
    try {
        const data = readData();
        const { userType, limit } = req.query;
        
        let interactions = data.interactions;
        
        if (userType) {
            interactions = interactions.filter(i => i.userType === userType);
        }
        
        if (limit) {
            interactions = interactions.slice(-parseInt(limit as string));
        }

        res.json(interactions);
    } catch (error) {
        console.error('Error getting interactions:', error);
        res.status(500).json({ error: 'Failed to get interactions' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



