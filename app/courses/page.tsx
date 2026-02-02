'use client';

import { useState, useEffect } from 'react';
import { getCourses, Course } from '@/lib/api';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      const tier = filter === 'all' ? undefined : filter;
      const data = await getCourses(tier);
      setCourses(data);
      setLoading(false);
    }
    loadCourses();
  }, [filter]);

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">⛳ ParPass</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Find Courses</h2>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['all', 'core', 'premium'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilter(tier)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tier
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading courses...</div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
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
