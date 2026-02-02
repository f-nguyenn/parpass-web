'use client';

import { useState } from 'react';
import { getMemberByCode, getMemberUsage, Member, Usage } from '@/lib/api';

export default function Home() {
  const [code, setCode] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const memberData = await getMemberByCode(code.toUpperCase());
      const usageData = await getMemberUsage(memberData.id);
      setMember(memberData);
      setUsage(usageData);
      localStorage.setItem('parpass_code', code.toUpperCase());
    } catch (err) {
      setError('Invalid ParPass code. Try PP100001');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setMember(null);
    setUsage(null);
    setCode('');
    localStorage.removeItem('parpass_code');
  };

  if (member && usage) {
    return (
      <div className="min-h-screen bg-green-50">
        <header className="bg-green-700 text-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">⛳ ParPass</h1>
            <button
              onClick={handleLogout}
              className="text-green-200 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          {/* Member Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {member.first_name} {member.last_name}
                </h2>
                <p className="text-gray-600">{member.health_plan_name}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  member.tier === 'premium' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {member.tier.toUpperCase()} MEMBER
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-700">
                  {member.monthly_rounds - usage.rounds_used}
                </div>
                <div className="text-gray-500 text-sm">rounds remaining</div>
                <div className="text-gray-400 text-xs mt-1">
                  {usage.rounds_used} of {member.monthly_rounds} used this month
                </div>
              </div>
            </div>

            {/* ParPass Code Display */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-gray-500 text-sm">Your ParPass Code</div>
              <div className="text-3xl font-mono font-bold tracking-widest text-gray-800">
                {member.parpass_code}
              </div>
              <div className="text-gray-500 text-xs mt-1">Show this at check-in</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/courses"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">🏌️</div>
              <h3 className="font-bold text-gray-800">Find Courses</h3>
              <p className="text-gray-500 text-sm">Browse nearby courses</p>
            </a>
            <a
              href="/favorites"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-bold text-gray-800">Favorites</h3>
              <p className="text-gray-500 text-sm">Your saved courses</p>
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">⛳ ParPass</h1>
          <p className="text-gray-600">Your golf network membership</p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="block text-gray-700 font-medium mb-2">
            Enter your ParPass code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PP100001"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-xl tracking-widest uppercase"
            maxLength={8}
          />
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Demo codes: PP100001 - PP100010
        </p>
      </div>
    </div>
  );
}
