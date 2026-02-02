const API_URL = 'http://localhost:3001/api';

export interface Course {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  holes: number;
  tier_required: 'core' | 'premium';
  phone: string;
  latitude: string;
  longitude: string;
}

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  parpass_code: string;
  status: string;
  health_plan_name: string;
  tier: 'core' | 'premium';
  monthly_rounds: number;
}

export interface Usage {
  rounds_used: number;
}

export async function getCourses(tier?: string): Promise<Course[]> {
  const url = tier ? `${API_URL}/courses?tier=${tier}` : `${API_URL}/courses`;
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}

export async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${API_URL}/courses/${id}`, { cache: 'no-store' });
  return res.json();
}

export async function getMemberByCode(code: string): Promise<Member> {
  const res = await fetch(`${API_URL}/members/code/${code}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Member not found');
  return res.json();
}

export async function getMemberUsage(memberId: string): Promise<Usage> {
  const res = await fetch(`${API_URL}/members/${memberId}/usage`, { cache: 'no-store' });
  return res.json();
}

export async function getMemberFavorites(memberId: string): Promise<Course[]> {
  const res = await fetch(`${API_URL}/members/${memberId}/favorites`, { cache: 'no-store' });
  return res.json();
}

export async function checkIn(memberId: string, courseId: string, holesPlayed: number = 18) {
  const res = await fetch(`${API_URL}/check-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ member_id: memberId, course_id: courseId, holes_played: holesPlayed }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error);
  }
  return res.json();
}

export async function addFavorite(memberId: string, courseId: string) {
  const res = await fetch(`${API_URL}/members/${memberId}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_id: courseId }),
  });
  return res.json();
}

export async function removeFavorite(memberId: string, courseId: string) {
  const res = await fetch(`${API_URL}/members/${memberId}/favorites/${courseId}`, {
    method: 'DELETE',
  });
  return res.json();
}
