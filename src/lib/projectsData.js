// Projects Data Store
// Replace this data with your actual projects

export const projects = [
    {
        id: 1,
        slug: 'dafdev-portfolio',
        title: 'DafDev Portfolio',
        shortDescription: 'Modern portfolio website with stunning animations and interactive 3D elements.',
        description: [
            'DafDev is my personal portfolio website built using Next.js and modern web technologies.',
            'It showcases my projects and experiences through an interactive design, enhanced with animations and a modern, user-friendly UI/UX.',
            'The website is designed to create an engaging user experience while clearly presenting my skills, work, and professional journey.'
        ],
        tags: ['Next.js', 'Three.js', 'Tailwind', 'PostgreSQL', 'Prisma', 'React', 'TypeScript'],
        // Replace with actual video path when available: '/videos/dafdev-demo.mp4'
        mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        mediaType: 'image', // Change to 'video' when video is available
        websiteUrl: 'https://example.com',
        githubUrl: 'https://github.com/username/dafdev',
        publishedDate: 'January 31, 2026',
        featured: true,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 2,
        slug: 'chess-game',
        title: 'My Chess',
        shortDescription: 'Interactive chess game with custom piece logic and beautiful UI design.',
        description: [
            'This website is a chess game built with manually implemented piece logic to handle all chess rules and movements.',
            'Each chess piece is programmed individually, requiring complex logical reasoning to ensure accurate gameplay.',
            'The project is designed to train and improve logical thinking, problem-solving skills, and understanding of game mechanics through hands-on logic implementation.'
        ],
        tags: ['HTML', 'CSS', 'JavaScript', 'Canvas'],
        mediaUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80',
        mediaType: 'image',
        websiteUrl: 'https://example.com/chess',
        githubUrl: 'https://github.com/username/chess',
        publishedDate: 'December 15, 2025',
        featured: true,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        id: 3,
        slug: 'ecommerce-platform',
        title: 'ShopVerse',
        shortDescription: 'Full-featured e-commerce platform with payment integration and admin dashboard.',
        description: [
            'ShopVerse is a comprehensive e-commerce solution built with modern technologies to provide seamless shopping experience.',
            'Features include user authentication, product catalog, shopping cart, payment processing with Stripe, and a complete admin dashboard.',
            'The platform is optimized for performance and scalability, handling thousands of products and concurrent users efficiently.'
        ],
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express'],
        mediaUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        mediaType: 'image',
        websiteUrl: 'https://example.com/shopverse',
        githubUrl: 'https://github.com/username/shopverse',
        publishedDate: 'November 20, 2025',
        featured: false,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
        id: 4,
        slug: 'task-manager',
        title: 'TaskFlow',
        shortDescription: 'Collaborative task management app with real-time updates and team features.',
        description: [
            'TaskFlow is a modern task management application designed for teams and individuals to organize their work efficiently.',
            'Real-time collaboration features allow multiple team members to update tasks simultaneously with instant synchronization.',
            'Built with productivity in mind, featuring drag-and-drop kanban boards, deadline reminders, and detailed analytics.'
        ],
        tags: ['SvelteKit', 'Firebase', 'Tailwind', 'WebSocket'],
        mediaUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
        mediaType: 'image',
        websiteUrl: 'https://example.com/taskflow',
        githubUrl: 'https://github.com/username/taskflow',
        publishedDate: 'October 5, 2025',
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
