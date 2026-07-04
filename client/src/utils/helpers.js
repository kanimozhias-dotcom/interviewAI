import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');
export const formatRelative = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};
export const getGradeColor = (score) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 75) return 'text-blue-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};
export const getGradeBg = (score) => {
  if (score >= 90) return 'bg-green-500/10 border-green-500/30';
  if (score >= 75) return 'bg-blue-500/10 border-blue-500/30';
  if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
  if (score >= 40) return 'bg-orange-500/10 border-orange-500/30';
  return 'bg-red-500/10 border-red-500/30';
};
export const truncateText = (text, maxLen = 100) =>
  text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
export const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
export const scoreToGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  return 'F';
};
export const clampScore = (score) => Math.min(100, Math.max(0, Math.round(score)));
export const roleLabel = (role) => {
  const map = {
    frontend: 'Frontend Developer',
    react: 'React Developer',
    java: 'Java Developer',
    python: 'Python Developer',
    fullstack: 'Full Stack Developer',
  };
  return map[role] || role;
};
