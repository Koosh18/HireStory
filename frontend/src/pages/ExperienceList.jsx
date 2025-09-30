import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function ExperienceList() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);

  const inFlightRef = useRef(false);
  async function load() {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    try {
      const { data } = await api.get('/experiences', { params: { page, limit: pageSize, sort } });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setSearched(true);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  useEffect(() => {
    // don't auto-load to respect "No results found" initial state
  }, []);

  const filtered = useMemo(() => {
    let base = items;
    if (tab === 'mine' && currentUser) base = base.filter((e) => (e.author?._id || e.author) === currentUser.id);
    if (tab === 'others' && currentUser) base = base.filter((e) => (e.author?._id || e.author) !== currentUser.id);
    // Per spec, 'Others' should show all experiences (no filtering by author)
    if (!query.trim()) return base;
    try {
      const rx = new RegExp(query, 'i');
      return base.filter((e) =>
        rx.test(e.company) || rx.test(e.role) || rx.test(String(e.year)) || rx.test(e.verdict || '') ||
        (e.rounds || []).some((r) => rx.test(r)) || (e.tips && rx.test(e.tips))
      );
    } catch (_) {
      return base;
    }
  }, [items, query, tab, currentUser]);

  const sorted = useMemo(() => {
    const arr = filtered.slice();
    if (sort === 'recent') arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'oldest') arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === 'company') arr.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
    return arr;
  }, [filtered, sort]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Experiences</h1>
        <Link to="/add" className="bg-black text-white rounded px-3 py-2">Add Experience</Link>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 border rounded flex flex-wrap gap-3 items-center shadow-sm">
        <div className="inline-flex rounded-lg border overflow-hidden">
          <button className={`px-3 py-2 text-sm ${tab==='all'?'bg-gray-900 text-white':'bg-white dark:bg-gray-800 dark:text-gray-200'}`} onClick={() => setTab('all')}>All</button>
          <button className={`px-3 py-2 text-sm ${tab==='mine'?'bg-gray-900 text-white':'bg-white dark:bg-gray-800 dark:text-gray-200'}`} onClick={() => setTab('mine')}>My Experiences</button>
          <button className={`px-3 py-2 text-sm ${tab==='others'?'bg-gray-900 text-white':'bg-white dark:bg-gray-800 dark:text-gray-200'}`} onClick={() => setTab('others')}>Others</button>
        </div>
        <input
          className="flex-1 min-w-[200px] border rounded px-3 py-2 bg-white dark:bg-gray-800"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="border rounded px-3 py-2 bg-white dark:bg-gray-800" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="recent">Recently added</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A→Z</option>
        </select>
        <button className="bg-black text-white rounded px-3 py-2" onClick={load}>Load</button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && (!searched || (searched && filtered.length === 0)) && (
        <div className="text-sm text-gray-600">
          No results found. Try a different search or add a new experience.
        </div>
      )}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-900 border rounded-2xl p-5">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="mt-2 h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="mt-3 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      )}
      {!loading && sorted.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((e) => (
            <Link key={e._id} to={`/experiences/${e._id}`} className="block bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm hover:shadow transition">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">{(e.company||'?')[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sky-700 dark:text-sky-300">{e.company}</div>
                    <div className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{e.role} • {e.year}</div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{e.rounds?.length || 0} Rounds</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{e.problems?.length || 0} Problems</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${e.verdict==='accepted'?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300': e.verdict==='rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{e.verdict==='accepted'?'Accepted': e.verdict==='rejected'?'Rejected':'Awaiting result'}</span>
                    {!e.anonymous && e.author && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">By {e.author?.name || e.author?.email || 'User'}</span>
                    )}
                  </div>
                  {e.tips && <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 line-clamp-2">{e.tips}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && searched && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border rounded disabled:opacity-50" disabled={page<=1} onClick={() => { setPage((p)=>p-1); setTimeout(load, 0); }}>Prev</button>
            <button className="px-3 py-2 border rounded disabled:opacity-50" disabled={page>=totalPages} onClick={() => { setPage((p)=>p+1); setTimeout(load, 0); }}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}


