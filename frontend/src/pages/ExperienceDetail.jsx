import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function ExperienceDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await api.get(`/experiences/${id}`);
      setItem(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Not found</p>;

  return (
    <article className="prose prose-slate max-w-none bg-white dark:bg-gray-900 border rounded-2xl p-5">
      <header>
        <h1 className="m-0">{item.company}</h1>
        <p className="m-0 text-sm text-gray-600 dark:text-gray-300">{item.role} • {item.year}</p>
        <div className="mt-2 flex gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{item.rounds?.length || 0} Rounds</span>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{item.problems?.length || 0} Problems</span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${item.verdict==='accepted'?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300': item.verdict==='rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{item.verdict==='accepted'?'Accepted': item.verdict==='rejected'?'Rejected':'Awaiting result'}</span>
          {!item.anonymous && item.author && (
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">By {item.author?.name || item.author?.email}</span>
          )}
        </div>
      </header>
      {item.rounds?.length > 0 && (
        <section>
          <h3>Interview Rounds</h3>
          <div className="grid gap-3">
            {item.rounds.map((r, i) => (
              <div key={i} className={`border rounded-xl p-4 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 flex items-center justify-center text-xs">{i + 1}</div>
                  <div className="font-medium">Round {i + 1}</div>
                </div>
                <p className="m-0 whitespace-pre-line leading-7">{r}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {item.problems?.length > 0 && (
        <section>
          <h3>Problems</h3>
          <div className="flex flex-wrap gap-2">
            {item.problems.map((url, i) => (
              <a key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800" href={url} target="_blank" rel="noreferrer">
                <span>🔗</span>
                <span>Problem {i + 1}</span>
              </a>
            ))}
          </div>
        </section>
      )}
      {item.tips && (
        <section>
          <h3>Tips</h3>
          <div className="border rounded-xl p-4 bg-amber-50 dark:bg-amber-900/20">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">💡</span>
              <p className="m-0 whitespace-pre-line leading-7">{item.tips}</p>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}


