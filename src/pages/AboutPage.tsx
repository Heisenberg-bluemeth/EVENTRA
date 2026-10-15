import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  Send,
  CheckCircle,
  HelpCircle,
  Box,
  MapPin
} from 'lucide-react';

const FAQS = [
  {
    question: 'What is EVENTRA?',
    answer:
      'EVENTRA is a next-generation 3D ticket booking universe for exploring concerts, high-stakes sports matches, IMAX 3D movies, festivals, comedy specials, and gaming tournaments in complete spatial immersion.'
  },
  {
    question: 'Are the tickets and events real or simulated?',
    answer:
      'All events, schedules, seats, and generated ticket passes within EVENTRA are demonstration simulations. No real credit card transactions are conducted, and issued demo passes cannot be used for actual entry into real-world stadiums or venues.'
  },
  {
    question: 'How does the 3D graphics engine work on mobile devices?',
    answer:
      'EVENTRA uses an adaptive WebGL rendering pipeline with Three.js, React Three Fiber, and Drei. On lower-powered devices or when reduced motion is preferred, users can toggle our high-performance 2D Mode from the navigation bar anytime.'
  },
  {
    question: 'Where is my ticket data and preferences stored?',
    answer:
      'All saved wishlists, city preferences, and booked demo passes are saved exclusively inside your browser’s LocalStorage. No user telemetry is harvested or sold.'
  }
];

export const AboutPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Support form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill out all required fields before submitting.');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 relative z-10">
      {/* Brand Story Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-950/80 border border-electric-500/40 text-cyber-cyan text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          The EVENTRA Vision
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Discover the Moment. <br />
          Experience the Extraordinary.
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
          Built to transform ordinary event discovery into a cinematic, three-dimensional journey. From the pulse of arena stadium floodlights to the intimate reverberation of acoustic stages.
        </p>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-midnight-900 border border-midnight-700/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-electric-500/10 text-electric-400 border border-electric-500/20 flex items-center justify-center">
            <Box className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Full-Page 3D Engine</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Every route features purposeful spatial computing elements, including interactive event portals, 3D stadium pitches, and volumetric projector cones.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-midnight-900 border border-midnight-700/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Interactive Seating Bowls</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Explore venues in 3D perspective or switch seamlessly to our accessible 2D seat map with live availability and reservation limits.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-midnight-900 border border-midnight-700/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">Holographic Wallet</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Issued demo passes feature real-time 3D metallic tilt, verified references, cancellation management, and offline browser storage.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-mono text-slate-400">Everything you need to know about the EVENTRA platform</p>
        </div>

        <div className="divide-y divide-midnight-800 rounded-3xl bg-midnight-900 border border-midnight-700 overflow-hidden">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index}>
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-midnight-850/60 transition-colors"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyber-cyan transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Support & Inquiries Contact Form */}
      <section className="p-8 sm:p-12 rounded-3xl bg-midnight-900 border border-midnight-700 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-cyber-cyan">
            <Send className="w-4 h-4" />
            <span>Support & Partnership Inquiry</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Connect with the EVENTRA Team
          </h2>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Inquiry Received Successfully!</span>
            </div>
            <p>
              Thank you for testing EVENTRA support. This is a simulated demo confirmation; your inquiry has been recorded in the client runtime.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-950 border border-midnight-700 text-white text-xs font-mono focus:outline-none focus:border-cyber-cyan"
                  placeholder="e.g. Jordan Lee"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-midnight-950 border border-midnight-700 text-white text-xs font-mono focus:outline-none focus:border-cyber-cyan"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Inquiry / Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-midnight-950 border border-midnight-700 text-white text-xs font-mono focus:outline-none focus:border-cyber-cyan"
                placeholder="Ask a question about spatial venue computing, tournament integrations, or platform features..."
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-cyber-cyan text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-glow-violet"
            >
              Submit Demo Inquiry
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
