import { useMemo, useState } from 'react';
import Modal from '../ui/Modal.jsx';

const sampleExperiences = [
  {
    id: 's1',
    title: 'Cracked SDE Internship',
    company: 'Acme Corp',
    role: 'SDE Intern',
    summary: '2 rounds DS&A + 1 behavioral; results awaited.',
    verdict: 'awaiting',
    anonymous: true,
    detail: {
      year: 2025,
      rounds: [
        'Round 1: Arrays, hash maps, complexity discussion',
        'Round 2: Trees + system design lite',
        'HR: Projects, team fit',
      ],
      tips: 'Practice medium LeetCode; be clear about trade-offs.'
    },
  },
  {
    id: 's2',
    title: 'Data Analyst Offer',
    company: 'Beta Analytics',
    role: 'Data Analyst',
    summary: 'Case interview on A/B tests; offer received.',
    verdict: 'accepted',
    anonymous: false,
    detail: {
      year: 2025,
      rounds: [
        'Case: Experiment design and metrics',
        'Technical: SQL live coding',
      ],
      tips: 'Revise SQL window functions and hypothesis testing.'
    },
  },
  {
    id: 's3',
    title: 'ML Engineer Journey',
    company: 'Gamma AI',
    role: 'ML Engineer',
    summary: 'ML concepts and coding; got rejected but learned a lot.',
    verdict: 'rejected',
    anonymous: false,
    detail: {
      year: 2024,
      rounds: [
        'ML theory: bias-variance, regularization',
        'Coding: graph traversal + edge cases',
      ],
      tips: 'Know fundamentals; explain intuitions with examples.'
    },
  },
];

export default function Landing() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return sampleExperiences;
    try {
      const rx = new RegExp(query, 'i');
      return sampleExperiences.filter((e) =>
        rx.test(e.title) || rx.test(e.company) || rx.test(e.role) || rx.test(e.summary)
      );
    } catch (_) {
      return sampleExperiences;
    }
  }, [query]);

  return (
    <div className="min-h-[70vh]">
      <section className="rounded-2xl bg-gradient-to-br from-fuchsia-500 via-sky-500 to-emerald-500 text-white p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow">Share and discover placement journeys</h1>
        <p className="mt-3 text-white/90 max-w-2xl">Real stories from seniors: interview rounds, OAs, tips, and resources — curated for students.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/login" className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-5 py-2.5 font-semibold shadow hover:shadow-md transition">Sign in with Google</a>
          <a href="#samples" className="inline-flex items-center justify-center rounded-full bg-black/20 px-5 py-2.5 font-semibold backdrop-blur hover:bg-black/25 transition">Browse sample stories</a>
        </div>
      </section>

      <section id="samples" className="mt-8">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xl font-semibold">Sample Experiences</h2>
          <input
            className="w-full sm:w-80 border rounded-lg px-3 py-2 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="Search (regex, case-insensitive)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {filtered.map((e) => (
            <button
              key={e.id}
              className="text-left bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow transition border"
              onClick={() => setActive(e)}
            >
          <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-sky-700 dark:text-sky-300">{e.company}</div>
            <div className="text-xs text-gray-700 dark:text-gray-300">{e.role}</div>
              </div>
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">{e.title}</div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{e.summary}</p>
          {e.verdict && (
            <div className="mt-3">
              <span className={`text-xs px-2 py-1 rounded-full ${e.verdict==='accepted'?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300': e.verdict==='rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{e.verdict==='accepted'?'Accepted': e.verdict==='rejected'?'Rejected':'Awaiting result'}</span>
              {!e.anonymous && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">By John Doe</span>
              )}
            </div>
          )}
            </button>
          ))}
        </div>
      </section>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.title || ''}>
        {active && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">{active.company} • {active.role} • {active.detail.year}</div>
            <div>
              <div className="font-medium">Online Assessment</div>
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{active.detail.oa}</p>
            </div>
            {active.detail.rounds?.length > 0 && (
              <div>
                <div className="font-medium">Interview Rounds</div>
                <div className="grid gap-2 mt-1">
                  {active.detail.rounds.map((r, i) => (
                    <div key={i} className={`border rounded-lg p-3 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <div className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Round {i + 1}</div>
                      <p className="text-sm m-0 text-gray-700 dark:text-gray-300">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {active.detail.tips && (
              <div>
                <div className="font-medium">Tips</div>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{active.detail.tips}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}


