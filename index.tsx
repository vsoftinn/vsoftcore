
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import * as THREE from 'three';
import { GoogleGenAI } from "@google/genai";

// --- Custom Hooks ---

function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return mousePosition;
}

// --- Custom Components ---

const VsoftLogo = () => (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img 
            src="https://res.cloudinary.com/deopcanic/image/upload/v1762699633/Untitled_design_1_fm25ty.svg" 
            alt="Vsoft Logo" 
            className="w-10 h-10 object-contain"
        />
        <span className="text-xl font-black text-white tracking-tighter uppercase">
            VSOFT<span className="text-indigo-500 font-light">.core</span>
        </span>
    </div>
);

const CustomCursor = () => {
    const { x, y } = useMousePosition();
    const cursorX = useSpring(x, { stiffness: 500, damping: 28 });
    const cursorY = useSpring(y, { stiffness: 500, damping: 28 });

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 border border-indigo-500 rounded-full pointer-events-none z-[9999] hidden md:block"
            style={{
                translateX: cursorX,
                translateY: cursorY,
                x: "-50%",
                y: "-50%"
            }}
        >
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#34d399]" />
        </motion.div>
    );
};

const VsoftBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 0.1,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.5,
        });

        const pointCloud = new THREE.Points(particlesGeometry, particlesMaterial);
        group.add(pointCloud);

        camera.position.z = 15;

        const animate = () => {
            requestAnimationFrame(animate);
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];
                if (Math.abs(positions[i * 3]) > 25) positions[i * 3] *= -0.9;
                if (Math.abs(positions[i * 3 + 1]) > 25) positions[i * 3 + 1] *= -0.9;
            }
            particlesGeometry.attributes.position.needsUpdate = true;
            group.rotation.y += 0.0008;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 -z-10 bg-[#020617] pointer-events-none" />;
};

const Terminal = () => {
    const [history, setHistory] = useState<string[]>([]);
    const [showVsoftFont, setShowVsoftFont] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const vsoftShenanigans = useMemo(() => [
        "VSOFT_KERNEL_v2.5: Initializing...",
        "AUTH_TOKEN: Successfully verified Langat_Victor.",
        "LOAD: blackhole_exploit.so [TARGET: Node_0x7A]",
        "SIM: Packet redirection cycle starting...",
        "THREAT: Blackhole vulnerability successfully mapped.",
        "---",
        "SYNC: vsoft-enterprise-erp connection established.",
        "PUSH: production_payload.json [SIZE: 42kb]",
        "STATUS: Sync broadcast complete to 12 clusters.",
        "---",
        "NEURAL_CORE: Scaling Gemini inference speed...",
        "PURGE: Weight vectors in latent layer 42 cleaned.",
        "BENCHMARK: 14ms inference latency achieved.",
        "---",
        "SYSTEM: All protocols stable. Ending simulation."
    ], []);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < vsoftShenanigans.length) {
                setHistory(prev => [...prev, vsoftShenanigans[i]]);
                i++;
            } else {
                setShowVsoftFont(true);
                clearInterval(interval);
                setTimeout(() => {
                    setShowVsoftFont(false);
                    setHistory([]);
                    i = 0;
                }, 6000); 
            }
        }, 800);
        return () => clearInterval(interval);
    }, [vsoftShenanigans]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, showVsoftFont]);

    return (
        <div 
            className="terminal-window group bg-black/95 border border-indigo-500/30 rounded-2xl font-mono text-sm text-indigo-300 backdrop-blur-3xl shadow-[0_0_120px_rgba(79,70,229,0.12)] relative overflow-hidden flex flex-col h-[420px] max-w-full"
        >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-scan" />
            <div className="flex gap-2 p-4 border-b border-indigo-500/10 items-center shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="ml-4 text-[10px] text-indigo-500/40 font-black uppercase tracking-[0.2em]">vsoft-interactive-shell</span>
            </div>
            
            <div ref={scrollRef} className="p-6 flex-grow overflow-y-auto space-y-2 scrollbar-hide custom-scroll relative">
                <AnimatePresence>
                    {showVsoftFont ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-10 text-center"
                        >
                            <span className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-500/20 select-none tracking-tighter leading-none" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                                VSOFT
                            </span>
                            <span className="mt-4 text-[10px] uppercase tracking-[1em] text-emerald-400 font-black animate-pulse">Core Operational</span>
                        </motion.div>
                    ) : (
                        history.map((line, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i} 
                                className="leading-relaxed flex items-start"
                            >
                                <span className="text-emerald-500/30 mr-3 flex-shrink-0 font-bold">::</span>
                                <span className="opacity-80 font-medium">
                                    {line}
                                </span>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TiltCard = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const SkillCard = ({ name, icon, level, tags }: { name: string, icon: string, level: number, tags: string[] }) => (
    <TiltCard className="skill-card group bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-2xl relative overflow-hidden transition-all hover:border-indigo-500/40 shadow-xl">
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-5">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-500">{icon}</span>
                <h4 className="text-2xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors">{name}</h4>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
                {tags.map(t => <span key={t} className="text-[10px] uppercase font-mono px-3 py-1 bg-white/5 rounded-lg text-slate-500 border border-white/5">{t}</span>)}
            </div>
            <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">Expertise</span>
                    <span className="text-xs font-mono text-indigo-400 font-bold">{level}%</span>
                </div>
                <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${level}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-emerald-400"
                    />
                </div>
            </div>
        </div>
    </TiltCard>
);

const ExperienceCard = ({ role, company, period, description, tags }: { role: string, company: string, period: string, description: string, tags: string[] }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="project-card group relative bg-slate-900/60 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-3xl hover:border-indigo-500/30 transition-all flex flex-col h-full shadow-2xl"
    >
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-10">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20 font-black">{period}</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-2 group-hover:text-indigo-400 transition-colors tracking-tightest leading-tight">{role}</h3>
            <h4 className="text-lg font-bold text-indigo-400/80 mb-6 uppercase tracking-[0.2em]">{company}</h4>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 flex-grow font-medium">{description}</p>
            <div className="flex flex-wrap gap-3 mt-auto">
                {tags.map(tag => (
                    <span key={tag} className="text-[11px] font-mono px-4 py-2 bg-indigo-500/5 text-indigo-300 rounded-xl border border-indigo-500/10 font-bold">{tag}</span>
                ))}
            </div>
        </div>
    </motion.div>
);

const ProjectCard = ({ title, desc, tags, year, demoUrl }: { title: string, desc: string, tags: string[], year: string, demoUrl?: string }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="project-card group relative bg-slate-900/60 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-3xl hover:border-indigo-500/30 transition-all flex flex-col h-full shadow-2xl"
    >
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-10">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl border border-emerald-400/20 font-black">{year}</span>
            </div>
            <h3 className="text-4xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors tracking-tightest leading-tight">{title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 flex-grow font-medium">{desc}</p>
            <div className="flex flex-wrap gap-3 mb-10">
                {tags.map(tag => (
                    <span key={tag} className="text-[11px] font-mono px-4 py-2 bg-indigo-500/5 text-indigo-300 rounded-xl border border-indigo-500/10 font-bold">{tag}</span>
                ))}
            </div>
            {demoUrl && (
                <a 
                    href={demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-indigo-600 rounded-2xl text-[13px] font-black text-white hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                    Live Preview ↗
                </a>
            )}
        </div>
    </motion.div>
);

const ImageGenLab = () => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const generateImage = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
            });
            let imageUrl = null;
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }
            if (imageUrl) setResultImage(imageUrl);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="ai-lab" className="py-48 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-emerald-400 font-mono text-sm tracking-[0.5em] uppercase mb-4 block font-black">AI Synthesis</span>
                <h2 className="text-6xl font-black text-white mb-6">Neural Art Lab</h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">Manifest high-fidelity concepts using integrated Vsoft neural cores.</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                        placeholder="Describe a cybernetic landscape..."
                        className="flex-grow bg-black/40 border border-slate-700 rounded-2xl px-8 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                    />
                    <button 
                        disabled={loading}
                        onClick={generateImage}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-10 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg"
                    >
                        {loading ? "Synthesizing..." : "Manifest"}
                    </button>
                </div>

                <div className="aspect-video w-full bg-black/40 rounded-[2rem] overflow-hidden border border-slate-800 flex items-center justify-center relative shadow-inner">
                    {resultImage ? (
                        <img src={resultImage} alt="Neural Result" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-slate-800 font-mono uppercase tracking-widest font-black opacity-40">{loading ? "Computing Neural Vectors..." : "Awaiting Latent Seed"}</span>
                    )}
                </div>
            </div>
        </section>
    );
};

function App() {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative text-slate-300 selection:bg-indigo-600 selection:text-white overflow-x-hidden">
            <VsoftBackground />
            <CustomCursor />

            <nav className="fixed top-0 w-full z-50 px-10 py-6 flex justify-between items-center bg-slate-950/40 backdrop-blur-xl border-b border-white/5">
                <VsoftLogo />
                <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
                    <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">About</button>
                    <button onClick={() => scrollTo('skills')} className="hover:text-white transition-colors">Skills</button>
                    <button onClick={() => scrollTo('experience')} className="hover:text-white transition-colors">Experience</button>
                    <button onClick={() => scrollTo('engineered-works')} className="hover:text-white transition-colors">Projects</button>
                    <button onClick={() => scrollTo('ai-lab')} className="hover:text-white transition-colors">AI Lab</button>
                    <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">Contact</button>
                </div>
            </nav>

            <section className="min-h-screen flex items-center justify-center px-10 pt-20">
                <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-8">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                             Vsoft Engine Active
                        </div>
                        <h1 className="text-7xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tightest">
                            LANGAT<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">VICTOR</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 max-w-xl mb-12 font-medium">
                            Architecting resilient distributed systems through technical mastery and autonomous infrastructure.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <button 
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95"
                                onClick={() => scrollTo('engineered-works')}
                            >
                                Core Deployments
                            </button>
                            <button 
                                className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black transition-all hover:bg-white/10 active:scale-95"
                                onClick={() => scrollTo('contact')}
                            >
                                Contact Kernel
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <Terminal />
                    </div>
                </div>
            </section>

            <section id="about" className="py-56 px-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-32 items-center">
                    <div className="space-y-12">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tightest">Systems Architect.</h2>
                        <p className="text-2xl text-slate-500 leading-relaxed font-bold">
                            With over 4 years of experience, I architect resilient ecosystems through full-stack mastery and automation. Trained in Mathematics and Computer Science, I focus on uncompromised data integrity and future-proof scalability.
                        </p>
                        <div className="grid grid-cols-2 gap-10">
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center shadow-xl">
                                <h4 className="text-5xl font-black text-white">4+</h4>
                                <p className="text-xs text-slate-600 uppercase tracking-widest font-black mt-2">Years Exp</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center shadow-xl">
                                <h4 className="text-5xl font-black text-white">99.9%</h4>
                                <p className="text-xs text-slate-600 uppercase tracking-widest font-black mt-2">Data Accuracy</p>
                            </div>
                        </div>
                    </div>
                    <div className="aspect-square rounded-[4rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-3xl relative group">
                        <img src="https://res.cloudinary.com/deopcanic/image/upload/v1762698702/idea_sfa5yg.svg" alt="Innovation" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent" />
                    </div>
                </div>
            </section>

            <section id="skills" className="py-56 px-10 max-w-7xl mx-auto">
                <h2 className="text-6xl font-black text-white mb-20 text-center tracking-tightest">Skill Inventory</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <SkillCard name="Programming" icon="💻" level={98} tags={['Python', 'JS/TS', 'C#', 'PHP', 'Java', 'SQL']} />
                    <SkillCard name="Frameworks" icon="⚛️" level={94} tags={['.NET Core', 'Node.js', 'Express', 'Django', 'React']} />
                    <SkillCard name="Databases" icon="🐘" level={92} tags={['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'MongoDB']} />
                    <SkillCard name="Systems" icon="🖥️" level={91} tags={['Windows Server', 'Linux (Ubuntu/CentOS)', 'VMware']} />
                    <SkillCard name="DevOps" icon="🐳" level={85} tags={['Git', 'Docker', 'CI/CD Fundamentals']} />
                    <SkillCard name="Web Dev" icon="🌐" level={96} tags={['Responsive Design', 'Backend Architecture', 'RESTful APIs']} />
                    <SkillCard name="Security" icon="🛡️" level={88} tags={['MANET Routing', 'Security Testing', 'Vulnerability Audit']} />
                    <SkillCard name="Methodology" icon="📋" level={95} tags={['Agile', 'Scrum', 'ITIL Fundamentals']} />
                </div>
            </section>

            <section id="experience" className="py-56 px-10 max-w-7xl mx-auto">
                <h2 className="text-6xl font-black text-white mb-20 tracking-tightest">Professional Roadmap</h2>
                <div className="grid lg:grid-cols-2 gap-10">
                    <ExperienceCard 
                        role="Systems Developer | Tech Consultant" 
                        company="Freelance" 
                        period="Nov 2023 - Present" 
                        description="Designing enterprise POS systems and automation kernels. Specialized in high-scale database cleanup and API reliability. Achieved 99.9% data accuracy through rigorous audit protocols." 
                        tags={['Enterprise ERP', 'Automation', 'Full Stack', 'Database Integrity']} 
                    />
                    <ExperienceCard 
                        role="Data Analyst" 
                        company="Twiga Foods" 
                        period="Dec 2021 - Oct 2022" 
                        description="Analyzed massive datasets to support operational decision-making. Developed BI dashboards and optimized SQL queries for high-speed logistics reporting." 
                        tags={['Data Science', 'SQL Optimization', 'BI Dashboarding', 'Supply Chain']} 
                    />
                    <ExperienceCard 
                        role="IT Support Tech-Attachee" 
                        company="Kericho County Govt" 
                        period="Jan 2021 - Apr 2021" 
                        description="Provided first-line technical support for critical government infrastructure. Managed server operations, network backups, and hardware updates." 
                        tags={['Tech Support', 'SysAdmin', 'Networking', 'Server Ops']} 
                    />
                    <ExperienceCard 
                        role="BSc Mathematics & Computer Science" 
                        company="Maseno University" 
                        period="2017 - 2021" 
                        description="Second Class Honors. Comprehensive training in algorithmic logic, systems integration, and engineering principles." 
                        tags={['Computer Science', 'Algorithmic Logic', 'Systems Integration']} 
                    />
                </div>
            </section>

            <section id="engineered-works" className="py-56 px-10 max-w-7xl mx-auto">
                <h2 className="text-6xl font-black text-white mb-20 tracking-tightest">Core Deployments</h2>
                <div className="grid lg:grid-cols-2 gap-10">
                    <ProjectCard 
                        title="AI Simplified" 
                        desc="Neural educational cluster designed to deconstruct complex machine learning concepts for intuitive pedagogical mastery." 
                        tags={['AI-Native', 'React', 'Django', 'Gemini API']} 
                        year="2024" 
                        demoUrl="learnaisimply.com" 
                    />
                    <ProjectCard 
                        title="Geke Luxury" 
                        desc="Bespoke digital sanctuary for art curators, featuring ultra-low latency cores and sophisticated transactional integrity." 
                        tags={['Luxury Retail', 'Next.js', 'Stripe', 'Art-Tech']} 
                        year="2023" 
                        demoUrl="https://geke.netlify.app/" 
                    />
                    <ProjectCard 
                        title="V-Pharm ERP" 
                        desc="Mission-critical pharmacy logistics engine with predictive inventory synchronization and robust security auditing." 
                        tags={['C# Enterprise', 'SQL Cluster', 'ERP Logistics']} 
                        year="2024" 
                        demoUrl="drive.google.com/file/d/1gmFB-Hp5q98Yr-6M55o8aJCT2Ju9YNtO/view?usp=sharing" 
                    />
                    <ProjectCard 
                        title="Cyber MANET Hub" 
                        desc="Simulation hub for decentralized wireless cluster vulnerability mapping and Blackhole attack modeling." 
                        tags={['CyberSec', 'NS-3', 'C++', 'Threat Modeling']} 
                        year="2022" 
                        demoUrl="https://drive.google.com/file/d/1eQZvuF2FQttwJdypDS8yhHdt5U87_uQ1/view?usp=sharing" 
                    />
                </div>
            </section>

            <ImageGenLab />

            <section id="contact" className="py-56 px-10 max-w-5xl mx-auto">
                <div className="bg-indigo-600 rounded-[4rem] p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-emerald-500 opacity-50" />
                    <div className="relative z-10">
                        <h2 className="text-6xl md:text-8xl font-black mb-10 leading-none tracking-tightest">Let's Build.</h2>
                        <p className="text-2xl text-indigo-100 max-w-2xl mx-auto mb-16 font-bold">Ready for high-impact systems architecture and elite tech consultation.</p>
                        <a href="mailto:Langatvictor299@gmail.com" className="inline-block bg-white text-indigo-700 px-16 py-6 rounded-2xl font-black text-2xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95">Connect Kernel</a>
                    </div>
                </div>
            </section>

            <footer className="py-24 px-10 border-t border-white/5 bg-slate-950/40 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
                    <div className="col-span-2">
                        <VsoftLogo />
                        <p className="mt-8 text-slate-500 max-w-sm leading-relaxed font-medium">
                            Engineered for reliability. We specialize in secure distributed systems, mission-critical automation, and real-time neural network integrations. Based in Nairobi, serving global clusters.
                        </p>
                        <div className="mt-10 flex gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Systems Operational</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 border-b border-white/5 pb-2">Navigation</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><button onClick={() => scrollTo('about')} className="hover:text-indigo-400 transition-colors">About Core</button></li>
                            <li><button onClick={() => scrollTo('skills')} className="hover:text-indigo-400 transition-colors">Expertise</button></li>
                            <li><button onClick={() => scrollTo('engineered-works')} className="hover:text-indigo-400 transition-colors">Deployments</button></li>
                            <li><button onClick={() => scrollTo('ai-lab')} className="hover:text-indigo-400 transition-colors">AI Synthesis</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8 border-b border-white/5 pb-2">Connect</h4>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><a href="https://github.com/vsoftinn" target="_blank" className="hover:text-indigo-400 transition-colors">GitHub Repository</a></li>
                            <li><a href="https://linkedin.com/in/langat-victor" target="_blank" className="hover:text-indigo-400 transition-colors">LinkedIn Profile</a></li>
                            <li><a href="mailto:Langatvictor299@gmail.com" className="hover:text-indigo-400 transition-colors">Direct Protocol (Email)</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
                    <div className="flex flex-col gap-2">
                        <span>Vsoft Innovations © 2025. All protocols preserved.</span>
                        <span className="opacity-40">Nairobi, Kenya • Eastern Africa Cluster</span>
                    </div>
                    <div className="hover:text-indigo-500 transition-colors cursor-default select-none">
                        Latent Layer: Stable
                    </div>
                </div>
            </footer>
        </div>
    );
}

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
