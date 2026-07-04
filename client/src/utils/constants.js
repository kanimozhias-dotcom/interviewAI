export const ROLES = [
  { value: 'frontend', label: 'Frontend Developer', icon: '🎨', color: 'from-orange-500 to-pink-500', description: 'HTML, CSS, JavaScript, Web APIs' },
  { value: 'react', label: 'React Developer', icon: '⚛️', color: 'from-cyan-500 to-blue-500', description: 'React, Hooks, State Management, JSX' },
  { value: 'java', label: 'Java Developer', icon: '☕', color: 'from-red-500 to-orange-500', description: 'Java, OOP, Spring Boot, JVM' },
  { value: 'python', label: 'Python Developer', icon: '🐍', color: 'from-yellow-500 to-green-500', description: 'Python, Django, Flask, Data Structures' },
  { value: 'fullstack', label: 'Full Stack Developer', icon: '🚀', color: 'from-violet-500 to-purple-500', description: 'Frontend + Backend + Database + DevOps' },
];

export const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', description: '0-1 years experience' },
  { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', description: '2-4 years experience' },
  { value: 'advanced', label: 'Advanced', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', description: '5+ years experience' },
];

export const BADGES = [
  { id: 'first_interview', name: 'First Step', description: 'Completed your first interview', icon: '🎯' },
  { id: 'streak_3', name: 'On Fire', description: '3-day interview streak', icon: '🔥' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day interview streak', icon: '⚡' },
  { id: 'perfect_score', name: 'Perfectionist', description: 'Scored 100 on an interview', icon: '💯' },
  { id: 'score_90', name: 'Excellence', description: 'Scored 90+ on an interview', icon: '🏆' },
  { id: 'interviews_5', name: 'Dedicated', description: 'Completed 5 interviews', icon: '📚' },
  { id: 'interviews_10', name: 'Expert', description: 'Completed 10 interviews', icon: '🎓' },
  { id: 'all_roles', name: 'Versatile', description: 'Tried all interview roles', icon: '🌟' },
];

export const SKILL_COLORS = {
  frontend: '#f97316',
  react: '#06b6d4',
  java: '#ef4444',
  python: '#eab308',
  fullstack: '#8b5cf6',
};

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/interview/setup', label: 'Start Interview', icon: 'Play' },
  { path: '/reports', label: 'My Reports', icon: 'FileText' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart2' },
  { path: '/roadmap', label: 'Learning Roadmap', icon: 'Map' },
  { path: '/profile', label: 'Profile', icon: 'User' },
];

export const QUESTION_TIMER_SECONDS = 90;
export const QUESTIONS_PER_INTERVIEW = 10;
