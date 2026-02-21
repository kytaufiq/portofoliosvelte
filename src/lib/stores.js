import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme Store
function createThemeStore() {
    const defaultTheme = browser ? (localStorage.getItem('theme') || 'dark') : 'dark';
    const { subscribe, set, update } = writable(defaultTheme);

    return {
        subscribe,
        toggle: () => {
            update(current => {
                const newTheme = current === 'dark' ? 'light' : 'dark';
                if (browser) {
                    localStorage.setItem('theme', newTheme);
                    document.documentElement.setAttribute('data-theme', newTheme);
                }
                return newTheme;
            });
        },
        set: (value) => {
            if (browser) {
                localStorage.setItem('theme', value);
                document.documentElement.setAttribute('data-theme', value);
            }
            set(value);
        }
    };
}

export const theme = createThemeStore();

// Language Store
function createLanguageStore() {
    const defaultLang = browser ? (localStorage.getItem('language') || 'EN') : 'EN';
    const { subscribe, set, update } = writable(defaultLang);

    return {
        subscribe,
        toggle: () => {
            update(current => {
                const newLang = current === 'EN' ? 'ID' : 'EN';
                if (browser) {
                    localStorage.setItem('language', newLang);
                }
                return newLang;
            });
        },
        set: (value) => {
            if (browser) {
                localStorage.setItem('language', value);
            }
            set(value);
        }
    };
}

export const language = createLanguageStore();

// Translations
export const translations = {
    EN: {
        // Navbar
        nav: {
            home: 'Home',
            about: 'About',
            skills: 'Skills',
            projects: 'Projects',
            experience: 'Experience',
            contact: 'Contact'
        },
        // Home
        home: {
            badge: 'Available for freelance work',
            greeting: "Hi, I'm",
            name: 'Zaky',
            title1: 'Creative Developer',
            title2: '& Designer',
            subtitle: 'I craft beautiful, interactive web experiences with modern technologies. Turning complex ideas into elegant, user-friendly solutions.',
            viewProjects: 'View Projects',
            contactMe: 'Contact Me',
            yearsExp: 'Years Experience',
            projectsCompleted: 'Projects Completed',
            happyClients: 'Happy Clients',
            scroll: 'Scroll to explore'
        },
        // About
        about: {
            label: 'About Me',
            title: 'Passionate Developer Creating',
            titleHighlight: 'Digital Experiences',
            description1: "I'm a creative developer with a passion for building beautiful, functional, and user-centered digital experiences. With a background in Computer Science and years of hands-on experience, I bring ideas to life through clean code and thoughtful design.",
            description2: 'My journey in web development started with curiosity and has evolved into a deep love for crafting interactive experiences. I specialize in modern JavaScript frameworks, UI/UX design, and creating seamless user experiences.',
            location: 'Location',
            education: 'Education',
            experience: 'Experience',
            languages: 'Languages',
            letsConnect: "Let's Connect"
        },
        // Skills
        skills: {
            label: 'Skills & Expertise',
            title: 'Technologies I',
            titleHighlight: 'Work With',
            subtitle: 'A comprehensive toolkit for building modern, scalable, and beautiful applications',
            frontend: 'Frontend',
            backend: 'Backend',
            tools: 'Tools & Design',
            alsoFamiliar: 'Also familiar with'
        },
        // Projects
        projects: {
            label: 'Portfolio',
            title: 'Featured',
            titleHighlight: 'Projects',
            subtitle: 'A selection of my recent work, showcasing creativity and technical expertise',
            all: 'All Projects',
            frontend: 'Frontend',
            fullstack: 'Full Stack',
            viewAll: 'View All Projects'
        },
        // Experience
        experience: {
            label: 'Career Path',
            title: 'Work',
            titleHighlight: 'Experience',
            subtitle: 'My professional journey in the world of web development',
            fullTime: 'Full-time',
            contract: 'Contract',
            internship: 'Internship'
        },
        // Contact
        contact: {
            label: 'Contact',
            title: "Let's Work",
            titleHighlight: 'Together',
            subtitle: "Have a project in mind? I'd love to hear from you. Let's create something amazing!",
            infoTitle: 'Get in Touch',
            infoText: "I'm currently available for freelance projects and full-time opportunities. Feel free to reach out if you want to collaborate or just say hi!",
            getInTouch: 'Get in Touch',
            description: "I'm currently available for freelance projects and full-time opportunities. Feel free to reach out if you want to collaborate or just say hi!",
            email: 'Email',
            location: 'Location',
            linkedin: 'LinkedIn',
            followMe: 'Follow me on',
            form: {
                name: 'Your Name',
                email: 'Email Address',
                subject: 'Subject',
                message: 'Message',
                send: 'Send Message'
            },
            footer: 'Crafted with 💜 using Svelte & GSAP'
        }
    },
    ID: {
        // Navbar
        nav: {
            home: 'Beranda',
            about: 'Tentang',
            skills: 'Keahlian',
            projects: 'Proyek',
            experience: 'Pengalaman',
            contact: 'Kontak'
        },
        // Home
        home: {
            badge: 'Tersedia untuk pekerjaan freelance',
            greeting: 'Hai, Saya',
            name: 'Zaky',
            title1: 'Developer Kreatif',
            title2: '& Desainer',
            subtitle: 'Saya membuat pengalaman web yang indah dan interaktif dengan teknologi modern. Mengubah ide kompleks menjadi solusi yang elegan dan mudah digunakan.',
            viewProjects: 'Lihat Proyek',
            contactMe: 'Hubungi Saya',
            yearsExp: 'Tahun Pengalaman',
            projectsCompleted: 'Proyek Selesai',
            happyClients: 'Klien Puas',
            scroll: 'Scroll untuk menjelajahi'
        },
        // About
        about: {
            label: 'Tentang Saya',
            title: 'Developer Passionate dalam Menciptakan',
            titleHighlight: 'Pengalaman Digital',
            description1: 'Saya adalah developer kreatif dengan passion untuk membangun pengalaman digital yang indah, fungsional, dan berpusat pada pengguna. Dengan latar belakang Ilmu Komputer dan pengalaman praktis bertahun-tahun, saya mewujudkan ide melalui kode yang bersih dan desain yang thoughtful.',
            description2: 'Perjalanan saya dalam pengembangan web dimulai dari rasa ingin tahu dan telah berkembang menjadi kecintaan mendalam untuk membuat pengalaman interaktif. Saya mengkhususkan diri dalam framework JavaScript modern, desain UI/UX, dan menciptakan pengalaman pengguna yang seamless.',
            location: 'Lokasi',
            education: 'Pendidikan',
            experience: 'Pengalaman',
            languages: 'Bahasa',
            letsConnect: 'Mari Terhubung'
        },
        // Skills
        skills: {
            label: 'Keahlian & Expertise',
            title: 'Teknologi yang Saya',
            titleHighlight: 'Gunakan',
            subtitle: 'Toolkit komprehensif untuk membangun aplikasi modern, scalable, dan indah',
            frontend: 'Frontend',
            backend: 'Backend',
            tools: 'Tools & Desain',
            alsoFamiliar: 'Juga familiar dengan'
        },
        // Projects
        projects: {
            label: 'Portofolio',
            title: 'Proyek',
            titleHighlight: 'Unggulan',
            subtitle: 'Pilihan karya terbaru saya, menampilkan kreativitas dan keahlian teknis',
            all: 'Semua Proyek',
            frontend: 'Frontend',
            fullstack: 'Full Stack',
            viewAll: 'Lihat Semua Proyek'
        },
        // Experience
        experience: {
            label: 'Perjalanan Karir',
            title: 'Pengalaman',
            titleHighlight: 'Kerja',
            subtitle: 'Perjalanan profesional saya di dunia pengembangan web',
            fullTime: 'Full-time',
            contract: 'Kontrak',
            internship: 'Magang'
        },
        // Contact
        contact: {
            label: 'Kontak',
            title: 'Mari Bekerja',
            titleHighlight: 'Bersama',
            subtitle: 'Punya proyek dalam pikiran? Saya senang mendengar dari Anda. Mari ciptakan sesuatu yang luar biasa!',
            infoTitle: 'Hubungi Saya',
            infoText: 'Saya saat ini tersedia untuk proyek freelance dan kesempatan full-time. Jangan ragu untuk menghubungi jika ingin berkolaborasi atau sekedar menyapa!',
            getInTouch: 'Hubungi Saya',
            description: 'Saya saat ini tersedia untuk proyek freelance dan kesempatan full-time. Jangan ragu untuk menghubungi jika ingin berkolaborasi atau sekedar menyapa!',
            email: 'Email',
            location: 'Lokasi',
            linkedin: 'LinkedIn',
            followMe: 'Ikuti saya di',
            form: {
                name: 'Nama Anda',
                email: 'Alamat Email',
                subject: 'Subjek',
                message: 'Pesan',
                send: 'Kirim Pesan'
            },
            footer: 'Dibuat dengan 💜 menggunakan Svelte & GSAP'
        }
    }
};

// Helper function to get translation
export function t(lang, key) {
    const keys = key.split('.');
    let result = translations[lang];
    for (const k of keys) {
        result = result?.[k];
    }
    return result || key;
}
