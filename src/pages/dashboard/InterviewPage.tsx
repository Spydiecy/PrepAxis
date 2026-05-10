import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, MessageSquare, X, Send, Loader, Volume2, Users, Code, ChevronRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useApp } from '../../AppContext';
import { storeInterviewSession } from '../../services/apiService';

// ─── Types ────────────────────────────────────────────────────────────────────
type InterviewType = 'hr' | 'technical';
type InputMode = 'voice' | 'text';
type Screen = 'home' | 'choose-type-voice' | 'choose-type-text' | 'interview';

interface Msg { role: 'ai' | 'user'; text: string }
interface Feedback {
  score: number; summary: string;
  strengths: string[]; improvements: string[];
  categoryScores: { name: string; score: number }[];
}

// ─── Gemini ───────────────────────────────────────────────────────────────────
const GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`;

async function gemini(prompt: string): Promise<string> {
  const res = await fetch(GEMINI, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

function systemPrompt(type: InterviewType): string {
  const randomSection = type === 'hr'
    ? `Pick exactly 2-3 questions randomly from this pool:
- Tell me about a time you worked in a team and faced a conflict. How did you handle it?
- What is your biggest professional achievement so far?
- How do you handle stress and tight deadlines?
- What are your greatest strengths and one weakness?
- Why do you want to work in software engineering?
- Describe a situation where you showed leadership.
- How do you handle feedback or criticism?
- Where do you see yourself in 5 years?
- What motivates you every day at work?
- Tell me about a time you failed. What did you learn?`
    : `Pick exactly 2-3 questions randomly from this pool:
- Explain the difference between an array and a linked list. When would you use each?
- What is Big O notation? Give an example.
- Explain OOP principles: encapsulation, inheritance, polymorphism.
- What is the difference between SQL and NoSQL databases?
- Explain how React hooks work. What is useState and useEffect?
- What is a REST API? How does it differ from GraphQL?
- Explain event loop in JavaScript.
- What is the difference between == and === in JavaScript?
- How does version control (Git) work? What is a merge conflict?
- Describe a system design for a URL shortener.
- What is the difference between synchronous and asynchronous programming?
- What are SOLID principles in software engineering?`;

  return `You are a professional ${type === 'hr' ? 'HR' : 'Technical'} interviewer for a software engineering role.
STRICT RULES:
1. Ask exactly ONE question at a time.
2. After the candidate answers, give ONE brief acknowledgment, then ask the next question.
3. Never number questions. Never say "Question 1".
4. Sound natural like a real interviewer.
5. Total interview = exactly 6-7 questions.
QUESTION ORDER:
Step 1: Ask "Tell me about yourself and your background."
Step 2: Ask about their education.
Step 3: Ask about their most significant project.
Step 4: Ask about their career goals.
${randomSection}
IMPORTANT: After ALL 6-7 questions are answered, respond ONLY with: INTERVIEW_COMPLETE`;
}

function feedbackPrompt(type: InterviewType): string {
  const cats = type === 'hr'
    ? `{"name":"Communication","score":0},{"name":"Teamwork","score":0},{"name":"Leadership","score":0},{"name":"Problem Solving","score":0},{"name":"Cultural Fit","score":0}`
    : `{"name":"Technical Knowledge","score":0},{"name":"Problem Solving","score":0},{"name":"Communication","score":0},{"name":"Code Quality","score":0},{"name":"System Design","score":0}`;
  return `You are an expert interview coach. Analyze this ${type} interview transcript.
Return ONLY valid JSON:
{"score":<0-100>,"summary":"<2-3 sentences>","strengths":["<s1>","<s2>","<s3>"],"improvements":["<i1>","<i2>","<i3>"],"categoryScores":[${cats}]}`;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────
const ProgressBar: React.FC<{ count: number; max: number }> = ({ count, max }) => (
  <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
    <motion.div className="bg-[#FF6B2C] h-1 rounded-full"
      animate={{ width: `${Math.min((count / max) * 100, 95)}%` }} transition={{ duration: 0.5 }} />
  </div>
);

const TypingDots: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div className="flex justify-start">
    <div className={`${dark ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1`}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  </div>
);

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 50, circ = 2 * Math.PI * r;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#FF6B2C' : '#ef4444';
  return (
    <div className="relative w-32 h-32 mx-auto mb-2">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="font-mono text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
};

const CategoryBar: React.FC<{ name: string; score: number; dark: boolean }> = ({ name, score, dark }) => (
  <div className="mb-2.5">
    <div className="flex justify-between mb-1">
      <span className={`font-mono text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{name}</span>
      <span className="font-mono text-xs font-bold">{score}%</span>
    </div>
    <div className={`w-full ${dark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full h-1.5`}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.9, ease: 'easeOut' }}
        className={`h-1.5 rounded-full ${score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-[#FF6B2C]' : 'bg-red-500'}`} />
    </div>
  </div>
);

// ─── Feedback Screen ──────────────────────────────────────────────────────────
const FeedbackScreen: React.FC<{ feedback: Feedback; type: InterviewType; dark: boolean; onHome: () => void; onRetry: () => void }> = ({ feedback, type, dark, onHome, onRetry }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto py-4">
    <div className="text-center mb-4">
      <span className={`inline-block px-3 py-1 rounded-full font-mono text-xs font-bold mb-2 ${type === 'hr' ? 'bg-blue-50 text-blue-600' : 'bg-[#FF6B2C]/10 text-[#FF6B2C]'}`}>
        {type === 'hr' ? '👥 HR' : '💻 Technical'} Interview Results
      </span>
      <h2 className={`font-mono text-xl font-bold ${dark ? 'text-white' : ''}`}>Interview Complete!</h2>
    </div>
    <ScoreRing score={feedback.score} />
    <p className={`text-center font-mono text-sm font-bold mb-4 ${feedback.score >= 75 ? 'text-green-500' : feedback.score >= 50 ? 'text-[#FF6B2C]' : 'text-red-500'}`}>
      {feedback.score >= 75 ? '🌟 Excellent!' : feedback.score >= 50 ? '👍 Good job!' : '💪 Keep practicing!'}
    </p>
    <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 mb-3`}>
      <p className={`font-mono text-xs font-bold ${dark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>📝 Summary</p>
      <p className={`font-mono text-xs ${dark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{feedback.summary}</p>
    </div>
    <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-4 mb-3`}>
      <p className={`font-mono text-xs font-bold ${dark ? 'text-gray-200' : 'text-gray-700'} mb-3`}>📊 Breakdown</p>
      {feedback.categoryScores?.map((c, i) => <CategoryBar key={i} name={c.name} score={c.score} dark={dark} />)}
    </div>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-3">
        <p className="font-mono text-xs font-bold text-green-700 mb-2">✅ Strengths</p>
        {feedback.strengths.map((s, i) => <p key={i} className="font-mono text-xs text-green-800 mb-1">• {s}</p>)}
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
        <p className="font-mono text-xs font-bold text-orange-700 mb-2">📈 Improve</p>
        {feedback.improvements.map((s, i) => <p key={i} className="font-mono text-xs text-orange-800 mb-1">• {s}</p>)}
      </div>
    </div>
    <div className="flex gap-3">
      <button onClick={onHome} className={`flex-1 py-3 border-2 ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'} rounded-xl font-mono font-bold text-sm`}>← Home</button>
      <button onClick={onRetry} className="flex-1 py-3 bg-[#FF6B2C] text-white rounded-xl font-mono font-bold text-sm hover:bg-[#d95500]">Try Again</button>
    </div>
  </motion.div>
);

// ─── Intro Screen ─────────────────────────────────────────────────────────────
const IntroScreen: React.FC<{ type: InterviewType; inputMode: InputMode; dark: boolean; onStart: () => void; onBack: () => void }> = ({ type, inputMode, dark, onStart, onBack }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center py-6">
    <div className={`w-14 h-14 ${type === 'hr' ? 'bg-blue-50' : 'bg-[#FF6B2C]/10'} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
      {inputMode === 'voice' ? <Mic className={`w-7 h-7 ${type === 'hr' ? 'text-blue-500' : 'text-[#FF6B2C]'}`} /> : <MessageSquare className={`w-7 h-7 ${type === 'hr' ? 'text-blue-500' : 'text-[#FF6B2C]'}`} />}
    </div>
    <span className={`inline-block px-3 py-1 rounded-full font-mono text-xs font-bold mb-3 ${type === 'hr' ? 'bg-blue-50 text-blue-600' : 'bg-[#FF6B2C]/10 text-[#FF6B2C]'}`}>
      {type === 'hr' ? '👥 HR Interview' : '💻 Technical Interview'} • {inputMode === 'voice' ? '🎤 Voice' : '💬 Text'}
    </span>
    <h2 className={`font-mono text-xl font-bold mb-2 ${dark ? 'text-white' : ''}`}>Ready to start?</h2>
    <p className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mb-5`}>
      6-7 questions total. First 4 fixed, last 2-3 randomly picked each session!
    </p>
    <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4 mb-4 text-left`}>
      <p className={`font-mono text-xs font-bold ${dark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>📋 What will be asked:</p>
      {[
        { text: 'Tell me about yourself', fixed: true },
        { text: 'Education & what you studied', fixed: true },
        { text: 'Your most significant project', fixed: true },
        { text: 'Career goals', fixed: true },
        { text: `2-3 random ${type === 'hr' ? 'behavioral' : 'technical'} questions (different every time!)`, fixed: false },
      ].map((item, i) => (
        <div key={i} className={`flex items-center gap-2 py-1.5 border-b ${dark ? 'border-gray-700' : 'border-gray-100'} last:border-0`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.fixed ? 'bg-gray-200 text-gray-500' : type === 'hr' ? 'bg-blue-100 text-blue-600' : 'bg-[#FF6B2C]/10 text-[#FF6B2C]'}`}>
            {item.fixed ? '✓' : '~'}
          </span>
          <span className={`font-mono text-xs ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</span>
        </div>
      ))}
    </div>
    {inputMode === 'voice' && (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-left">
        <p className="font-mono text-xs font-bold text-orange-700 mb-1">⚠️ Before you start:</p>
        <p className="font-mono text-xs text-orange-800">Use Google Chrome • Allow microphone • AI will speak questions</p>
      </div>
    )}
    <div className="flex gap-3">
      <button onClick={onBack} className={`flex-1 py-3 border-2 ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'} rounded-xl font-mono font-bold text-sm`}>← Back</button>
      <button onClick={onStart} className="flex-1 py-3 bg-[#FF6B2C] text-white rounded-xl font-mono font-bold text-sm hover:bg-[#d95500]">Start Interview →</button>
    </div>
  </motion.div>
);

// ─── Choose Type Screen ───────────────────────────────────────────────────────
const ChooseTypeScreen: React.FC<{ inputMode: InputMode; dark: boolean; onSelect: (t: InterviewType) => void; onBack: () => void }> = ({ inputMode, dark, onSelect, onBack }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto py-6">
    <h2 className={`font-mono text-xl font-bold text-center mb-1 ${dark ? 'text-white' : ''}`}>Choose Interview Type</h2>
    <p className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} text-center mb-6`}>
      {inputMode === 'voice' ? '🎤 Voice mode selected' : '💬 Text mode selected'}
    </p>
    <div className="space-y-4 mb-6">
      {[
        { type: 'hr' as InterviewType, icon: <Users className="w-5 h-5 text-blue-500 group-hover:text-[#FF6B2C] transition-all" />, iconBg: 'bg-blue-50', title: 'HR Interview', desc: 'Behavioral, teamwork, leadership, goals. ~6-7 questions.', tags: [{ label: 'Behavioral', cls: 'bg-blue-50 text-blue-600' }, { label: 'Teamwork', cls: 'bg-blue-50 text-blue-600' }, { label: 'Leadership', cls: 'bg-blue-50 text-blue-600' }] },
        { type: 'technical' as InterviewType, icon: <Code className="w-5 h-5 text-[#FF6B2C]" />, iconBg: 'bg-orange-50', title: 'Technical Interview', desc: 'DSA, React, Node.js, system design. ~6-7 questions.', tags: [{ label: 'DSA', cls: 'bg-orange-50 text-[#FF6B2C]' }, { label: 'React', cls: 'bg-orange-50 text-[#FF6B2C]' }, { label: 'Node.js', cls: 'bg-orange-50 text-[#FF6B2C]' }] },
      ].map(({ type, icon, iconBg, title, desc, tags }) => (
        <motion.div key={type} whileHover={{ scale: 1.01 }} onClick={() => onSelect(type)}
          className={`border-2 ${dark ? 'border-gray-700 bg-gray-800 hover:border-[#FF6B2C]' : 'border-gray-200 hover:border-[#FF6B2C]'} rounded-2xl p-5 cursor-pointer group transition-all`}>
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 ${iconBg} group-hover:bg-[#FF6B2C]/10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all`}>
              {icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-mono text-base font-bold mb-0.5 ${dark ? 'text-white' : ''}`}>{title}</h3>
              <p className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{desc}</p>
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => (
                  <span key={tag.label} className={`px-2 py-0.5 ${tag.cls} font-mono text-xs rounded-full`}>{tag.label}</span>
                ))}
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${dark ? 'text-gray-500' : 'text-gray-300'} group-hover:text-[#FF6B2C] mt-1 transition-all flex-shrink-0`} />
          </div>
        </motion.div>
      ))}
    </div>
    <button onClick={onBack} className={`w-full py-3 border-2 ${dark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} rounded-xl font-mono font-bold text-sm`}>← Back</button>
  </motion.div>
);

// ─── Text Interview ───────────────────────────────────────────────────────────
const TextInterviewScreen: React.FC<{ type: InterviewType; dark: boolean; userId: string | null; onHome: () => void }> = ({ type, dark, userId, onHome }) => {
  const [screen, setScreen] = useState<'intro' | 'chat' | 'feedback'>('intro');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [answered, setAnswered] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const startInterview = async () => {
    setScreen('chat'); setLoading(true);
    const q = await gemini(systemPrompt(type) + '\n\nStart now. Ask your first question naturally.');
    setMessages([{ role: 'ai', text: q }]); setLoading(false);
  };

  const sendAnswer = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim(); setInput('');
    const updated: Msg[] = [...messages, { role: 'user', text: userText }];
    setMessages(updated); setAnswered(a => a + 1); setLoading(true);
    const history = updated.map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n\n');
    const reply = await gemini(systemPrompt(type) + '\n\nTranscript:\n' + history + '\n\nContinue as interviewer.');
    if (reply.includes('INTERVIEW_COMPLETE')) {
      const fb = await generateFeedback(updated);
      // ✅ Save to Firestore
      if (userId) {
        await storeInterviewSession(
          userId, type, 'text',
          fb.score, fb.summary, fb.strengths, fb.improvements, fb.categoryScores
        );
      }
      setFeedback(fb); setScreen('feedback'); setLoading(false);
    } else { setMessages([...updated, { role: 'ai', text: reply }]); setLoading(false); }
  };

  const generateFeedback = async (msgs: Msg[]): Promise<Feedback> => {
    const history = msgs.map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n\n');
    const raw = await gemini(feedbackPrompt(type) + '\n\nTranscript:\n' + history);
    try { return JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}'); }
    catch { return { score: 65, summary: 'Good effort! Keep practicing.', strengths: ['Clear communication', 'Enthusiasm', 'Good structure'], improvements: ['More examples', 'Elaborate more', 'Be concise'], categoryScores: type === 'hr' ? [{ name: 'Communication', score: 70 }, { name: 'Teamwork', score: 65 }, { name: 'Leadership', score: 60 }, { name: 'Problem Solving', score: 68 }, { name: 'Cultural Fit', score: 65 }] : [{ name: 'Technical Knowledge', score: 65 }, { name: 'Problem Solving', score: 68 }, { name: 'Communication', score: 70 }, { name: 'Code Quality', score: 60 }, { name: 'System Design', score: 63 }] }; }
  };

  const reset = () => { setScreen('intro'); setMessages([]); setInput(''); setFeedback(null); setAnswered(0); };

  if (screen === 'intro') return <IntroScreen type={type} inputMode="text" dark={dark} onStart={startInterview} onBack={onHome} />;
  if (screen === 'feedback' && feedback) return <FeedbackScreen feedback={feedback} type={type} dark={dark} onHome={onHome} onRetry={reset} />;

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[74vh]">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold ${type === 'hr' ? 'bg-blue-50 text-blue-600' : 'bg-[#FF6B2C]/10 text-[#FF6B2C]'}`}>{type === 'hr' ? '👥 HR' : '💻 Tech'}</span>
          <span className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-400'}`}>{answered} answered</span>
        </div>
        <button onClick={onHome} className={`p-1 ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}><X className="w-4 h-4 text-gray-400" /></button>
      </div>
      <ProgressBar count={answered} max={7} />
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 font-mono text-sm leading-relaxed ${m.role === 'ai' ? `${dark ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'} rounded-tl-sm` : 'bg-[#FF6B2C] text-white rounded-tr-sm'}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && <TypingDots dark={dark} />}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendAnswer()}
          placeholder="Type your answer..." disabled={loading}
          className={`flex-1 border-2 ${dark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-200 bg-white'} rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:border-[#FF6B2C] disabled:opacity-50`} />
        <button onClick={sendAnswer} disabled={loading || !input.trim()}
          className="w-10 h-10 bg-[#FF6B2C] disabled:bg-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

// ─── Voice Interview ──────────────────────────────────────────────────────────
const VoiceInterviewScreen: React.FC<{ type: InterviewType; dark: boolean; userId: string | null; onHome: () => void }> = ({ type, dark, userId, onHome }) => {
  const [screen, setScreen] = useState<'intro' | 'session' | 'feedback'>('intro');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentQ, setCurrentQ] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [answered, setAnswered] = useState(0);
  const recRef = useRef<any>(null);

  const speak = (text: string): Promise<void> => new Promise(resolve => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92; setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); resolve(); };
    u.onerror = () => { setIsSpeaking(false); resolve(); };
    window.speechSynthesis.speak(u);
  });

  const startInterview = async () => {
    setScreen('session'); setLoading(true);
    const q = await gemini(systemPrompt(type) + '\n\nStart now. Ask your first question naturally.');
    setCurrentQ(q); setMessages([{ role: 'ai', text: q }]); setLoading(false);
    await speak(q);
  };

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Please use Google Chrome for voice interviews.'); return; }
    const rec = new SR(); rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
    rec.onresult = (e: any) => setTranscript(Array.from(e.results).map((r: any) => r[0].transcript).join(''));
    rec.start(); recRef.current = rec; setIsRecording(true); setTranscript('');
  };

  const stopAndSend = async () => {
    recRef.current?.stop(); setIsRecording(false);
    if (!transcript.trim()) return;
    const userText = transcript; setTranscript('');
    const updated: Msg[] = [...messages, { role: 'user', text: userText }];
    setMessages(updated); setAnswered(a => a + 1); setLoading(true);
    const history = updated.map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n\n');
    const reply = await gemini(systemPrompt(type) + '\n\nTranscript:\n' + history + '\n\nContinue as interviewer.');
    if (reply.includes('INTERVIEW_COMPLETE')) {
      const fb = await generateFeedback(updated);
      // ✅ Save to Firestore
      if (userId) {
        await storeInterviewSession(
          userId, type, 'voice',
          fb.score, fb.summary, fb.strengths, fb.improvements, fb.categoryScores
        );
      }
      setFeedback(fb); setScreen('feedback'); setLoading(false);
    } else { setMessages([...updated, { role: 'ai', text: reply }]); setCurrentQ(reply); setAnswered(a => a + 1); setLoading(false); await speak(reply); }
  };

  const generateFeedback = async (msgs: Msg[]): Promise<Feedback> => {
    const history = msgs.map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n\n');
    const raw = await gemini(feedbackPrompt(type) + '\n\nTranscript:\n' + history);
    try { return JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}'); }
    catch { return { score: 65, summary: 'Good effort! Keep practicing.', strengths: ['Communication', 'Enthusiasm', 'Structure'], improvements: ['More examples', 'Elaborate', 'Concise'], categoryScores: type === 'hr' ? [{ name: 'Communication', score: 70 }, { name: 'Teamwork', score: 65 }, { name: 'Leadership', score: 60 }, { name: 'Problem Solving', score: 68 }, { name: 'Cultural Fit', score: 65 }] : [{ name: 'Technical Knowledge', score: 65 }, { name: 'Problem Solving', score: 68 }, { name: 'Communication', score: 70 }, { name: 'Code Quality', score: 60 }, { name: 'System Design', score: 63 }] }; }
  };

  const reset = () => { window.speechSynthesis.cancel(); setScreen('intro'); setMessages([]); setFeedback(null); setAnswered(0); setCurrentQ(''); setTranscript(''); };

  if (screen === 'intro') return <IntroScreen type={type} inputMode="voice" dark={dark} onStart={startInterview} onBack={onHome} />;
  if (screen === 'feedback' && feedback) return <FeedbackScreen feedback={feedback} type={type} dark={dark} onHome={onHome} onRetry={reset} />;

  return (
    <div className="max-w-lg mx-auto py-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold ${type === 'hr' ? 'bg-blue-50 text-blue-600' : 'bg-[#FF6B2C]/10 text-[#FF6B2C]'}`}>{type === 'hr' ? '👥 HR' : '💻 Tech'}</span>
          <span className={`font-mono text-xs text-gray-400`}>{answered} answered</span>
        </div>
        <button onClick={onHome} className={`p-1 ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}><X className="w-4 h-4 text-gray-400" /></button>
      </div>
      <ProgressBar count={answered} max={7} />
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-2 rounded-2xl p-4 mb-4 min-h-[100px] flex items-start gap-3`}>
        <div className="flex-shrink-0 mt-0.5">
          {isSpeaking && <Volume2 className="w-5 h-5 text-[#FF6B2C] animate-pulse" />}
          {loading && !isSpeaking && <Loader className="w-5 h-5 text-gray-400 animate-spin" />}
          {!loading && !isSpeaking && <MessageSquare className="w-5 h-5 text-gray-300" />}
        </div>
        <p className={`font-mono text-sm ${dark ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`}>
          {loading && !currentQ ? 'Preparing first question...' : currentQ}
        </p>
      </div>
      <AnimatePresence>
        {(isRecording || transcript) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-[#FF6B2C]/5 border-2 border-[#FF6B2C]/30 rounded-2xl p-4 mb-4">
            <p className="font-mono text-xs text-[#FF6B2C] font-bold mb-1">🎤 Your answer:</p>
            <p className={`font-mono text-sm ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{transcript || 'Listening...'}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col items-center gap-3">
        {!isRecording ? (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startRecording}
            disabled={loading || isSpeaking}
            className="w-20 h-20 rounded-full bg-[#FF6B2C] disabled:bg-gray-400 flex items-center justify-center shadow-lg shadow-[#FF6B2C]/30">
            <Mic className="w-8 h-8 text-white" />
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={stopAndSend}
            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <MicOff className="w-8 h-8 text-white" />
            </motion.div>
          </motion.button>
        )}
        <p className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
          {isSpeaking ? '🔊 Interviewer speaking...' : loading ? '⏳ Processing...' : isRecording ? '🔴 Recording — tap to stop & send' : '🎤 Tap to speak your answer'}
        </p>
      </div>
    </div>
  );
};

// ─── Home Screen ──────────────────────────────────────────────────────────────
const HomeScreen: React.FC<{ dark: boolean; onVoice: () => void; onText: () => void }> = ({ dark, onVoice, onText }) => (
  <div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <p className={`text-xs font-mono ${dark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
        Practice with AI-powered mock interviews
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <motion.div whileHover={{ scale: 1.02 }} onClick={onVoice}
          className="border-2 border-[#FF6B2C] rounded-xl p-4 bg-[#FF6B2C]/5 cursor-pointer">
          <Mic className="h-6 w-6 text-[#FF6B2C] mb-2" />
          <h3 className={`text-base font-mono font-bold mb-1 ${dark ? 'text-white' : ''}`}>Voice Interview</h3>
          <p className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Speak your answers — AI listens and responds with voice</p>
          <div className="flex gap-1 mb-3">
            <span className="px-2 py-0.5 font-mono text-xs rounded-full bg-blue-50 text-blue-600">HR</span>
            <span className="px-2 py-0.5 font-mono text-xs rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C]">Technical</span>
          </div>
          <span className="font-mono font-bold text-sm text-[#FF6B2C]">Start Practice →</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} onClick={onText}
          className={`border-2 ${dark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'} rounded-xl p-4 cursor-pointer`}>
          <MessageSquare className={`h-6 w-6 ${dark ? 'text-gray-400' : 'text-gray-600'} mb-2`} />
          <h3 className={`text-base font-mono font-bold mb-1 ${dark ? 'text-white' : ''}`}>Text Interview</h3>
          <p className={`font-mono text-xs ${dark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Type your answers — great for written communication practice</p>
          <div className="flex gap-1 mb-3">
            <span className="px-2 py-0.5 font-mono text-xs rounded-full bg-blue-50 text-blue-600">HR</span>
            <span className="px-2 py-0.5 font-mono text-xs rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C]">Technical</span>
          </div>
          <span className={`font-mono font-bold text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Start Practice →</span>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const InterviewPage: React.FC = () => {
  const { darkMode } = useApp();
  const [screen, setScreen] = useState<Screen>('home');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [interviewType, setInterviewType] = useState<InterviewType>('hr');
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  const goHome = () => setScreen('home');
  const handleTypeSelect = (t: InterviewType) => { setInterviewType(t); setScreen('interview' as any); };

  if (screen === 'choose-type-voice' || screen === 'choose-type-text') {
    return <ChooseTypeScreen inputMode={inputMode} dark={darkMode} onSelect={handleTypeSelect} onBack={goHome} />;
  }
  if (screen === ('interview' as any)) {
    return inputMode === 'text'
      ? <TextInterviewScreen type={interviewType} dark={darkMode} userId={userId} onHome={goHome} />
      : <VoiceInterviewScreen type={interviewType} dark={darkMode} userId={userId} onHome={goHome} />;
  }
  return (
    <HomeScreen dark={darkMode}
      onVoice={() => { setInputMode('voice'); setScreen('choose-type-voice'); }}
      onText={() => { setInputMode('text'); setScreen('choose-type-text'); }}
    />
  );
};

export default InterviewPage;