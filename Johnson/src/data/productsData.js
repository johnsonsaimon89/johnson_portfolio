export const productsData = {
    paid: [
        {
            id: 'sm-calendar',
            title: 'Social Media Content Calendar Template',
            priceTZS: 5000,
            type: 'Digital Download',
            description: 'Pre-filled monthly content calendar for planning posts and campaigns',
            salesCount: '15-30 per month'
        },
        {
            id: 'sm-masterclass',
            title: 'Masterclass: Storytelling in Social Media',
            priceTZS: 50000,
            type: 'Video Module + Workbook',
            description: 'Beginner-friendly storytelling series with actionable tips for engagement',
            salesCount: '15-30 per month'
        },
        {
            id: 'ux-starter',
            title: 'Website UX Starter Kit',
            priceTZS: 30000,
            type: 'Template pack + guideline PDF',
            description: 'Pre-designed wireframes, UX templates, and layout tips for web designers',
            salesCount: '15-30 per month'
        }
    ],
    free: [
        {
            id: 'brand-voice',
            title: 'Brand Voice Worksheet',
            priceTZS: 0,
            type: 'PDF Download',
            description: 'A simple worksheet to define your brand voice and tone',
            downloads: '120+'
        },
        {
            id: 'post-ideas',
            title: 'Social Media Post Idea Generator',
            priceTZS: 0,
            type: 'Google Sheet/Template',
            description: 'Quickly generate 30 post ideas per month',
            downloads: '120+'
        }
    ],
    payment: {
        supported: ['Bank Payment', 'Lipa Number'],
        workflow: [
            'Select product',
            'Choose payment method',
            'Show instructions for mobile/bank transfer',
            'After payment, fill short confirmation form: Name, Email, Phone, Proof of Payment'
        ],
        notifications: {
            email: 'New purchase attempt: [Product Name], [Customer Name], [Payment Method]',
            whatsapp: 'WhatsApp alert for instant tracking',
            dashboard: 'Admin Dashboard: Track purchase status (pending/confirmed)'
        },
        microcopy: {
            postPayment: 'Thank you! Fill this form to receive your resource instantly.'
        }
    }
};
