export const webData = {
    hero: {
        title: "Studio",
        subtitle: "The Studio is where ideas become digital platforms.",
        description: "I design modern websites using platforms like Squarespace and Webflow, creating clean and responsive sites that help brands present their work clearly online.\n\nI also explore AI-assisted workflows to help speed up website creation and improve digital publishing."
    },
    projects: [
        {
            id: 'edulearn',
            client: 'EduLearn',
            industry: 'E-Learning Platform',
            challenge: "Students were struggling with a slow, frustrating mobile interface that made learning on the go nearly impossible. The existing platform was too complex for a quick, mobile-first generation.",
            solution: 'I redesigned the entire student experience with a focus on speed and intuition. By streamlining the layout and prioritizing mobile navigation, I made sure learning stayed fluid and accessible anywhere.',
            results: {
                pageLoad: '2.1s',
                mobileEngagement: '+63%',
                bounceRate: '-28%',
                accessibility: '98/100',
                seo: '92/100'
            },
            outcome: "These changes led to a 63% increase in mobile student engagement and significantly reduced bounce rates across the platform.",
            colors: ['#6366f1', '#1e293b', '#f8fafc'],
            platform: 'React + Next.js',
            tools: ['Figma', 'React', 'Vercel']
        },
        {
            id: 'visualculture',
            client: 'VisualCulture',
            industry: 'Creative Portfolio',
            challenge: "VisualCulture's original portfolio felt outdated and didn't match the level of their high-end creative work. They needed a presence that reflected their commitment to premium aesthetics.",
            solution: 'I built a modern, interactive site designed around fluid animations and clear storytelling. My goal was to create a digital home that showcases their projects in a way that feels as high-end as the work itself.',
            results: {
                interactionTime: '+45%',
                repeatVisits: '+22%',
                pageLoad: '1.8s',
                performance: '99/100'
            },
            outcome: "The new platform increased visitor interaction by 45% and established a more sophisticated online brand.",
            colors: ['#000000', '#BDFF00', '#ffffff'],
            platform: 'React + Framer Motion',
            tools: ['Figma', 'GSAP']
        },
        {
            id: 'greenfields',
            client: 'GreenFields',
            industry: 'Environmental NGO',
            challenge: "GreenFields had a complex, fragmented site that made it difficult for donors to understand their core mission. The story of their impact was getting lost in the noise.",
            solution: 'I redesigned the website to center around their environmental success stories. By simplifying the structure and creating an intuitive landing page, I helped them communicate their message clearly and effectively.',
            results: {
                pageLoad: '1.9s',
                formSubmissions: '+60%',
                retention: '+35%',
                conversion: '+12%'
            },
            outcome: "This project resulted in a 60% increase in form submissions, allowing them to share their story more effectively with the world.",
            colors: ['#065f46', '#f0fdf4', '#111827'],
            platform: 'Webflow',
            tools: ['Figma', 'Webflow CMS']
        }
    ],
    process: [
        { step: 1, title: "Discovery", desc: "I learn about your brand, audience, and growth goals." },
        { step: 2, title: "Architecture", desc: "I map out a fast, intuitive structure for your site." },
        { step: 3, title: "Design", desc: "I create modern visuals that tell your story perfectly." },
        { step: 4, title: "Launch", desc: "I test every detail to ensure a fast, successful launch." },
        { step: 5, title: "Growth", desc: "I help you maintain and iterate on your site to keep winning." }
    ],
    metrics: {
        pageSpeedRange: '1.8s - 2.1s',
        engagementRange: '+45% - +63%',
        bounceRateDrop: '28%'
    },
    testimonials: [
        {
            quote: "The mobile-first redesign transformed how our students interact with the platform. Engagement is at an all-time high.",
            author: "Director, EduLearn",
            role: "E-Learning Platform"
        },
        {
            quote: "Our new portfolio finally feels as premium as our creative work. The interaction design is exactly what we needed.",
            author: "Founder, VisualCulture",
            role: "Creative Studio"
        },
        {
            quote: "Simplifying our complex site allowed us to clearly communicate our mission. We've seen a massive jump in donor inquiries.",
            author: "Lead, GreenFields",
            role: "Environmental NGO"
        }
    ]
};
