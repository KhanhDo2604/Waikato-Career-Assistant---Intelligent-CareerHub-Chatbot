export const commonQuestions = [
    {
        id: 1,
        question: 'How do I book an appointment with the Careers Team?',
        answer: 'You can book an appointment through MyCareerHub by selecting a suitable time slot and confirming your booking.',
        category: 'Appointment',
    },
    {
        id: 2,
        question: 'Can I reschedule my appointment?',
        answer: 'Yes, you can reschedule your appointment by logging into MyCareerHub and selecting a new available time.',
        category: 'Appointment',
    },
    {
        id: 3,
        question: 'How do I find internship opportunities?',
        answer: 'You can browse internship listings on MyCareerHub under the Jobs & Opportunities section.',
        category: 'Internship',
    },
    {
        id: 4,
        question: 'Do I need a CV to apply for internships?',
        answer: 'Yes, most internship applications require a CV. You can also book a CV check appointment with the Careers Team.',
        category: 'Internship',
    },
    {
        id: 5,
        question: 'What services does the Careers Team offer?',
        answer: 'The Careers Team offers services such as CV reviews, interview preparation, career counseling, and job search assistance.',
        category: 'General',
    },
];

//Data structure
// common_questions (
//   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   question   TEXT NOT NULL,
//   answer     TEXT NOT NULL,
//   category   TEXT NOT NULL,                -- 'CV', 'Internship', 'Appointment', ...
//   is_active  BOOLEAN NOT NULL DEFAULT TRUE,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

// CREATE TABLE interactions (
//   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   anon_sid      UUID NOT NULL,             -- cookie HttpOnly (anon_sid)
//   user_type     TEXT NOT NULL DEFAULT 'user' CHECK (user_type IN ('user','alumni')),
//   question      TEXT NOT NULL,
//   answer        TEXT NOT NULL,
//   category      TEXT,                      -- snapshot category/type: 'CV', 'Job Search', ...
//   source        TEXT NOT NULL DEFAULT 'llm' CHECK (source IN ('llm','faq','handoff')),
//   created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
