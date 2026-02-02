'use client';

import { useState, useEffect, use } from 'react';
import { getCourse, getMemberFavorites, addFavorite, removeFavorite, Course } from '@/lib/api';
import { loadMemberFromStorage, AuthState } from '@/lib/auth';
import Link from 'next/link';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthState>({ member: null, usage: null });

  useEffect(() => {
    async function loadData() {
      const authState = await loadMemberFromStorage();
      setAuth(authState);

      const courseData = await getCourse(id);
      setCourse(courseData);

      if (authState.member) {
        const favs = await getMemberFavorites(authState.member.id);
        setIsFavorite(favs.some(f => f.id === id));
      }

      setLoading(false);
    }
    loadData();
  }, [id]);

  const toggleFavorite = async () => {
    if (!auth.member || !course) return;

    setIsFavorite(!isFavorite);

    try {
      if (isFavorite) {
        await removeFavorite(auth.member.id, course.id);
      } else {
        await addFavorite(auth.member.id, course.id);
      }
    } catch {
      setIsFavorite(isFavorite);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-gray-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h2>
          <Link href="/courses" className="text-emerald-600 hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(course.name + ', ' + course.city + ', ' + course.state)}&zoom=15&maptype=satellite`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(course.name + ', ' + course.city + ', ' + course.state + ' ' + course.zip)}`;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Map Header */}
      <div className="relative h-64 bg-gray-200">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        ></iframe>
        
        {/* Back Button Overlay */}
        <Link
          href="/courses"
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Favorite Button Overlay */}
        {auth.member && (
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            {isFavorite ? (
              <span className="text-xl">❤️</span>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 -mt-8 relative z-10 pb-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Course Info */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium mb-3 ${
                  course.tier_required === 'premium'
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {course.tier_required.toUpperCase()}
                </span>
                <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
                <p className="text-gray-500 mt-1">
                  {course.city}, {course.state} {course.zip}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg">⛳</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Holes</p>
                    <p className="text-lg font-semibold text-gray-900">{course.holes}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg">📞</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <a href={`tel:${course.phone}`} className="text-lg font-semibold text-gray-900 hover:text-emerald-600">
                      {course.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Actions */}
          <div className="p-4 grid grid-cols-2 gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Directions
            </a>
            <a
              href={`tel:${course.phone}`}
              className="flex items-center justify-center gap-2 bg-white text-gray-900 py-3.5 px-6 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
          </div>
        </div>

        {/* Tip Card */}
        <div className="bg-emerald-50 rounded-2xl p-5 mt-4 border border-emerald-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h3 className="font-medium text-emerald-900">Check-in Tip</h3>
              <p className="text-emerald-700 text-sm mt-1">
                Show your ParPass code at the pro shop when you arrive. Your round will be automatically logged.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
