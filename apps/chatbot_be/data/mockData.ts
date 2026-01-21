import { MongoClient, Collection } from 'mongodb';

interface InteractionDoc {
    anonSid: string;
    userType: 'user' | 'alumni';
    category: string;
    question: string;
    answer: string;
    createdAt: Date;
}

// Mock data templates
const CATEGORIES = [
    'CV Help',
    'Cover Letter',
    'Job Search',
    'Appointment',
    'EPA',
    'Internship',
    'Interview Preparation',
    'Career Guidance',
    'Workshop',
    'General Enquiry',
];

const QUESTIONS_BY_CATEGORY: Record<string, string[]> = {
    'CV Help': [
        'How can I improve my CV?',
        'What should I include in my CV?',
        'Can you review my CV?',
        'How long should my CV be?',
        'What format should I use for my CV?',
    ],
    'Cover Letter': [
        'How do I write a cover letter?',
        'What should I include in my cover letter?',
        'How long should a cover letter be?',
        'Do I need a cover letter for every application?',
    ],
    'Job Search': [
        'How can I find a part-time job?',
        'Where can I look for graduate positions?',
        'What are the best job search websites?',
        'How do I apply for jobs online?',
    ],
    Appointment: [
        'How do I book an appointment?',
        'Can I reschedule my appointment?',
        'Is my appointment online or in-person?',
        'What do I need to bring to my appointment?',
    ],
    EPA: [
        'How do I join the EPA award?',
        'How can I earn EPA points?',
        'What is the EPA certificate?',
        'Can I add volunteering to my EPA?',
    ],
    Internship: [
        'How do I find internships?',
        'What internships are available?',
        'How do I apply for an internship?',
        'Can I get course credit for my internship?',
    ],
    'Interview Preparation': [
        'How do I prepare for an interview?',
        'What questions will they ask in an interview?',
        'What should I wear to an interview?',
        'How do I answer behavioral questions?',
    ],
    'Career Guidance': [
        'What career options are available in my field?',
        'How do I choose a career path?',
        'Can I speak to a career counselor?',
        'What skills do employers look for?',
    ],
    Workshop: [
        'What workshops are available?',
        'How do I register for a workshop?',
        'Are workshops online or in-person?',
        'Do workshops count for EPA points?',
    ],
    'General Enquiry': [
        'What services do you offer?',
        'How can I contact support?',
        'What are your opening hours?',
        'Where is the career center located?',
    ],
};

const ANSWERS: Record<string, string> = {
    'CV Help':
        'You can upload your CV to our Application Support portal for review, or attend a drop-in session. Visit https://mycareer.waikato.ac.nz/students/appointments/app/topic/5?siteId=1',
    'Cover Letter':
        'Please refer to our Cover Letter guide at https://mycareer.waikato.ac.nz/students/docs/detail/8?filename=Cover-Letter-and-Verbs.pdf',
    'Job Search':
        'You can speak to a Career Consultant for job search advice. Book a drop-in session at https://mycareer.waikato.ac.nz/students/appointments/app/topic/5?siteId=1',
    Appointment:
        'You can book an appointment online at https://mycareer.waikato.ac.nz/students/appointments/app/?siteId=1',
    EPA: 'Join the Employability Plus Award here: https://mycareer.waikato.ac.nz/s/epa',
    Internship:
        'Please connect with the WMS WIL Team at msc@waikato.ac.nz or visit https://www.waikato.ac.nz/about/faculties-schools/management/student-experience/work-integrated-learning/',
    'Interview Preparation':
        'You can book an interview preparation appointment at https://mycareer.waikato.ac.nz/students/appointments/app/topic/1?siteId=1',
    'Career Guidance':
        'Book a career guidance session with our consultants at https://mycareer.waikato.ac.nz/students/appointments/app/?siteId=1',
    Workshop:
        'Check our workshop schedule at https://mycareer.waikato.ac.nz/students/events?eventTypeIds=9&page=1&studentSiteId=1',
    'General Enquiry': 'For general enquiries, email mycareer@waikato.ac.nz or visit our website.',
};

// Helper function to generate random date within a range
function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate random anonymous session ID
function generateAnonSid(): string {
    return `anon_${Math.random().toString(36).substring(2, 15)}`;
}

// Generate mock interactions
function generateMockInteractions(count: number = 20): InteractionDoc[] {
    const interactions: InteractionDoc[] = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date();

    // Generate unique user sessions (simulate returning users)
    const userSessions: string[] = [];
    const sessionCount = Math.floor(count * 0.7); // 70% unique users, 30% returning
    for (let i = 0; i < sessionCount; i++) {
        userSessions.push(generateAnonSid());
    }

    for (let i = 0; i < count; i++) {
        // Random category
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)] || 'Other';

        // Random question from category
        const questions = QUESTIONS_BY_CATEGORY[category];
        if (!questions || questions.length === 0) continue;
        const question = questions[Math.floor(Math.random() * questions.length)];

        // Get answer for category
        const answer = ANSWERS[category];

        // Random user type (80% user, 20% alumni)
        const userType = Math.random() > 0.2 ? 'user' : 'alumni';

        // Random session (70% unique, 30% returning)
        const anonSid =
            Math.random() > 0.3 ? userSessions[Math.floor(Math.random() * userSessions.length)] : generateAnonSid();

        // Random date
        const createdAt = randomDate(startDate, endDate);

        if (anonSid === undefined || question === undefined || answer === undefined) {
            continue;
        }
        interactions.push({
            anonSid,
            userType,
            category,
            question,
            answer,
            createdAt,
        });
    }

    // Sort by date (oldest first)
    return interactions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

// Main function to insert mock data
export async function insertMockData(count: number = 20) {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    console.log(uri);

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
        connectTimeoutMS: 10000,
    });

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const database = client.db('chatbot_db');
        const collection: Collection<InteractionDoc> = database.collection('interactions');

        // Clear existing data (optional)
        const clearExisting = process.env.CLEAR_EXISTING === 'true';
        if (clearExisting) {
            await collection.deleteMany({});
            console.log('🗑️  Cleared existing interactions');
        }

        // Generate and insert mock data
        const mockData = generateMockInteractions(count);
        const result = await collection.insertMany(mockData);

        console.log(`✅ Inserted ${result.insertedCount} mock interactions`);

        // Display summary
        const summary = mockData.reduce(
            (acc, interaction) => {
                acc[interaction.category] = (acc[interaction.category] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        console.log('\n📊 Summary by category:');
        Object.entries(summary).forEach(([category, count]) => {
            console.log(`  ${category}: ${count}`);
        });

        const uniqueUsers = new Set(mockData.map((i) => i.anonSid)).size;
        console.log(`\n👥 Unique users: ${uniqueUsers}`);
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await client.close();
        console.log('✅ MongoDB connection closed');
    }
}
