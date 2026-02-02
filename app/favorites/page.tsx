'use client';

import { useState, useEffect } from 'react';
import { getMemberByCode, getMemberFavorites, Course } from '@/lib/api';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFavorites() {
      // In a real app, you'd have proper session management
      // For now, we'll use a simple prompt or localStorage
      const code = localStorage.getItem('parpass_code');
      
      if (!code) {
        setError('Please sign in first');
        setLoading(false);
        return;
      }

      try {
        const member = await getMemberByCode(code);
        const favs = await getMemberFavorites(member.id);
        setFavorites(favs);
      } catch (err) {
        setError('Could not load favorites');
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">⛳ ParPass</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">⭐ Your Favorites</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading favorites...</div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Link 
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Sign In
            </Link>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <p className="text-gray-600 mb-4">No favorites yet</p>
            <Link 
              href="/courses"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                    <p className="text-gray-600">
                      {course.city}, {course.state} {course.zip}
                    </p>
                    <div className="flex gap-3 mt-2">
                      <span className="text-gray-500 text-sm">
                        🏌️ {course.holes} holes
                      </span>
                      <span className="text-gray-500 text-sm">
                        📞 {course.phone}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.tier_required === 'premium'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {course.tier_required}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
