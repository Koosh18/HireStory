import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Landing from './pages/Landing.jsx';
import ExperienceList from './pages/ExperienceList.jsx';
import ExperienceDetail from './pages/ExperienceDetail.jsx';
import AddExperience from './pages/AddExperience.jsx';

function useAuth() {
  const token = localStorage.getItem('token');
  return Boolean(token);
}

function PrivateRoute({ children }) {
  const authed = useAuth();
  const location = useLocation();
  if (!authed) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export default function App() {
  const authed = useAuth();
  return (
    <div className="min-h-screen">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={authed ? '/app' : '/'} className="font-semibold">Hire Story</Link>
          <nav className="space-x-3 flex items-center">
            {authed && <Link className="text-sm" to="/app">Experiences</Link>}
            {authed ? (
              <>
                <Link className="text-sm" to="/add">Add</Link>
                <button className="text-sm" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; }}>Logout</button>
              </>
            ) : (
              <Link className="text-sm" to="/login">Login</Link>
            )}
            <button
              aria-label="Toggle theme"
              className="ml-2 text-sm px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => {
                const root = document.documentElement;
                const next = root.classList.toggle('dark');
                localStorage.setItem('theme', next ? 'dark' : 'light');
              }}
            >
              🌗
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={authed ? <Navigate to="/app" replace /> : <Landing />} />
          <Route path="/login" element={authed ? <Navigate to="/app" replace /> : <Login />} />
          <Route path="/app" element={<PrivateRoute><ExperienceList /></PrivateRoute>} />
          <Route path="/experiences/:id" element={<PrivateRoute><ExperienceDetail /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><AddExperience /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}
