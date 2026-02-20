// Projects Data Store
// Replace this data with your actual projects

export const projects = [
    {
        id: 1,
        slug: 'dafdev-portfolio',
        title: 'DILTIFY Music Player',
        description: [
            'DILTIFY Music Player is a web-based music player built using Next.js and modern web technologies.',
            'It provides a user-friendly interface for users to listen to music and manage their playlists.',
            'additional features include a search bar, a library of popular songs, and the ability to create and manage playlists.',
        ],
        tags: ['Next.js', 'Tailwind', 'PostgreSQL', 'Prisma', 'React', 'TypeScript'],
        // Replace with actual video path when available: '/videos/dafdev-demo.mp4'
        mediaUrl: '/videos/diltify.mp4',
        mediaType: 'video', // Change to 'video' when video is available
        githubUrl: 'https://github.com/anndaanhr/Diltify',
        publishedDate: 'Nov 14, 2025',
        featured: true,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 2,
        slug: 'sisirptpn',
        title: 'SISIR (Sales and Inventories Statistic of Rubber)',
        description: [
            'This web-based system is designed to monitor rubber sales data at PT. Perkebunan Nusantara I Regional 7.',
            'Users can easily track and analyze rubber sales through clear and easy-to-understand graphical dashboards.',
            'The system provides structured data management features, allowing users to manage, update, and organize sales data efficiently.',
            'With visual reports and a user-friendly interface, the system helps improve accuracy, transparency, and decision-making in rubber sales monitoring.'
        ],
        tags: ['Laravel', 'PostgreSQL', 'Tailwind', 'PHP', 'CSS', 'JavaScript'],
        mediaUrl: '/videos/sisirptpn.mp4',
        mediaType: 'video',
        mediaStartTime: 5, // Format: angka detik (5) atau string menit:detik ("1:30" = menit 1 detik 30)
        githubUrl: 'https://github.com/dafffatih/SISIR_PTPN_7',
        publishedDate: 'Jan 17, 2026',
        featured: true,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        id: 3,
        slug: 'doittogether',
        title: 'DoItTogether',
        description: [
            'DoItTogether is a web-based task management and team collaboration platform that helps you organize work with friends or teammates in one place.',
            'Users can create, assign, and track tasks in real time, monitor progress at a glance, and collaborate efficiently without switching between multiple tools.',
            'With a clean and intuitive dark-themed interface, DoItTogether makes teamwork simpler, more transparent, and easier to manage from start to finish.'
        ],
        tags: ['Laravel', 'PostgreSQL', 'Tailwind', 'PHP', 'CSS', 'JavaScript'],
        mediaUrl: '/videos/doittogther.mp4',
        mediaType: 'video',
        githubUrl: 'https://github.com/Tesyaf/doittogether',
        publishedDate: 'Dec 9, 2025',
        featured: false,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
        id: 4,
        slug: 'sleep-disorder-expert-system',
        title: 'Sleep Disorder Expert System',
        description: [
            'Sleep Disorder Expert System is a web-based application designed to analyze users\' sleep patterns and overall health conditions.',
            'Users can input personal information, sleep habits, lifestyle data, and health indicators such as sleep duration, stress level, BMI category, heart rate, blood pressure, and daily steps.',
            'The system processes the data using a Random Forest machine learning model to predict potential sleep disorders such as Insomnia, Sleep Apnea, and Narcolepsy, while providing informative insights in a clean and user-friendly interface.'
        ],
tags: ['Laravel', 'PHP', 'Bootstrap 5', 'Python', 'Flask API', 'Random Forest', 'Machine Learning'],
        mediaUrl: '/videos/sleepdisorder.mp4',
        mediaType: 'video',
        githubUrl: 'https://github.com/kemasmalfath/Pakar_tidur',
        publishedDate: 'Dec 7, 2025',
        featured: false,
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
];

// Helper function to get project by slug
export function getProjectBySlug(slug) {
    return projects.find(p => p.slug === slug);
}

// Helper function to get featured projects
export function getFeaturedProjects() {
    return projects.filter(p => p.featured);
}
