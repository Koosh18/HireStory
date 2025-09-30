import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function AddExperience() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [year, setYear] = useState('');
  const [verdict, setVerdict] = useState('awaiting');
  const [rounds, setRounds] = useState(['']);
  const [problems, setProblems] = useState(['']);
  const [tips, setTips] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function updateArray(setter, arr, i, value) {
    const next = arr.slice();
    next[i] = value;
    setter(next);
  }

  function addField(setter, arr) {
    setter([...arr, '']);
  }

  function removeField(setter, arr, i) {
    const next = arr.slice();
    next.splice(i, 1);
    setter(next.length ? next : ['']);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        company,
        role,
        year: Number(year),
        verdict,
        rounds: rounds.filter(Boolean),
        problems: problems.filter(Boolean),
        tips,
        anonymous,
      };
      const { data } = await api.post('/experiences', payload);
      navigate(`/experiences/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add experience');
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 border rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-1">Add Experience</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Break down your journey into clear sections to help peers.</p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="space-y-3">
          <div className="font-semibold">Basics</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
            <input className="border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} required />
            <input className="border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required type="number" />
          </div>
          <p className="text-xs text-gray-500">Tip: Add exact role title and graduation year for better discovery.</p>
        </section>

        <section className="space-y-2">
          <div className="font-semibold">Verdict</div>
          <div className="flex gap-3">
            <select className="border rounded px-3 py-2 bg-white dark:bg-gray-800" value={verdict} onChange={(e) => setVerdict(e.target.value)}>
              <option value="awaiting">Awaiting result</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className={`px-3 py-2 rounded-full text-sm ${verdict==='awaiting'? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : verdict==='accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}`}>
              {verdict==='awaiting'?'Awaiting result': verdict==='accepted'?'Accepted':'Rejected'}
            </span>
          </div>
        </section>

        <section className="space-y-2">
          <div className="font-semibold">Posting Identity</div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-sky-600" checked={anonymous} onChange={(e)=>setAnonymous(e.target.checked)} />
            Post as Anonymous
          </label>
          <p className="text-xs text-gray-500">If unchecked, your name/email will be shown with the experience.</p>
        </section>

        <section className="space-y-2">
          <div className="font-semibold">Rounds</div>
          <div className="space-y-2">
            {rounds.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder={`Round ${i + 1}`} value={r} onChange={(e) => updateArray(setRounds, rounds, i, e.target.value)} />
                <button type="button" className="px-2 border rounded" onClick={() => removeField(setRounds, rounds, i)}>✕</button>
              </div>
            ))}
            <button type="button" className="text-sm underline" onClick={() => addField(setRounds, rounds)}>Add round</button>
          </div>
        </section>

        <section className="space-y-2">
          <div className="font-semibold">Problem Links</div>
          <div className="space-y-2">
            {problems.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-800" placeholder="https://..." value={p} onChange={(e) => updateArray(setProblems, problems, i, e.target.value)} />
                <button type="button" className="px-2 border rounded" onClick={() => removeField(setProblems, problems, i)}>✕</button>
              </div>
            ))}
            <button type="button" className="text-sm underline" onClick={() => addField(setProblems, problems)}>Add link</button>
          </div>
        </section>

        <section className="space-y-2">
          <div className="font-semibold">Tips</div>
          <textarea className="w-full border rounded px-3 py-2 min-h-[100px] bg-white dark:bg-gray-800" value={tips} onChange={(e) => setTips(e.target.value)} placeholder="What would you do differently? Resources to recommend?" />
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button className="bg-black text-white rounded px-4 py-2">Submit</button>
          <button type="button" className="border rounded px-4 py-2" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}


