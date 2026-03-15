/***/
import { motion } from 'framer-motion';
import { Zap, LayoutTemplate, Layers, Search, Smartphone, ShieldCheck } from 'lucide-react';

const features = [
    { icon: <Smartphone size={24} />, title: "Mobile-First", desc: "Pixel-perfect experiences that look great on iPhones and Androids." },
    { icon: <LayoutTemplate size={24} />, title: "Modern Design", desc: "Clean, bento-style layouts that keep your audience engaged." },
    { icon: <Layers size={24} />, title: "Storytelling", desc: "I map out your content to guide visitors toward a clear goal." },
    { icon: <Zap size={24} />, title: "Fast Loads", desc: "Optimized for speed so you never lose a potential client." },
    { icon: <Search size={24} />, title: "Search Ready", desc: "Built with SEO best practices to help people find you online." },
    { icon: <ShieldCheck size={24} />, title: "Easy to Manage", desc: "Built on platforms that make it simple for you to update content." }
];

const StudioFeatures = () => {
    return (
        <section className="section">
            <div className="container">
                <div style={{ textAlign: 'center', }}>
                    <h2 >
                        Engineered for <span style={{ color: 'var(--accent-color)' }}>Excellence</span>
                    </h2>
                </div>

                <div className="bento-grid">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bento-item"
                            style={{ gridColumn: idx < 2 ? 'span 6' : (idx < 5 ? 'span 4' : 'span 12') }}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'rgba(0, 242, 255, 0.1)',
                                color: 'var(--accent-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {feature.icon}
                            </div>
                            <h3 >{feature.title}</h3>
                            <p className="caption" style={{ color: 'var(--muted-color)', }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StudioFeatures;
