import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Fix for MongoDB Atlas SRV lookup on mobile hotspots
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// ─── Question Data ──────────────────────────────────────────────────────────

const questions = [

  // ═══════════════════════════════════════════════════
  // FRONTEND DEVELOPER — Entry-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'HTML & CSS',
    question: 'What is the difference between inline, block, and inline-block elements in HTML/CSS?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'HTML & CSS',
    question: 'Explain the CSS box model and the difference between content-box and border-box.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'HTML & CSS',
    question: 'What is Flexbox and when would you use it over CSS Grid?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'JavaScript',
    question: 'What is the difference between var, let, and const in JavaScript?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'JavaScript',
    question: 'Explain what a Promise is and how it differs from a callback.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'JavaScript',
    question: 'What is the DOM and how do you manipulate it using JavaScript?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'React',
    question: 'What is JSX and why is it used in React?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'React',
    question: 'What are props in React? How are they different from state?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'React',
    question: 'What is the useState hook? Give a simple example of how you would use it.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'General',
    question: 'What is the difference between HTTP and HTTPS?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'General',
    question: 'What is responsive web design and what CSS technique is central to it?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Entry-Level', category: 'JavaScript',
    question: 'Explain event bubbling and event capturing in JavaScript.'
  },

  // ═══════════════════════════════════════════════════
  // FRONTEND DEVELOPER — Mid-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'React',
    question: 'Explain the useEffect hook and its dependency array. When might you cause infinite re-renders?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'React',
    question: 'What is the Virtual DOM and how does React use reconciliation to update the UI efficiently?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'React',
    question: 'What are higher-order components (HOC) and what problem do they solve?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'React',
    question: 'How does React Context API work, and when would you choose it over prop drilling?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'Performance',
    question: 'How would you optimise the performance of a React application? Name at least 3 techniques.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'Performance',
    question: 'What is lazy loading and code splitting? How do you implement them in a React app?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'JavaScript',
    question: 'Explain closures in JavaScript with a practical example.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'JavaScript',
    question: 'What is the event loop and how does JavaScript handle asynchronous operations?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'CSS',
    question: 'What are CSS custom properties (variables)? How do they compare to preprocessor variables like Sass?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'Testing',
    question: 'What is unit testing in frontend development? Which tools would you use to test a React component?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'State Management',
    question: 'When would you use Redux versus React Context for state management? What are the trade-offs?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Mid-Level', category: 'Accessibility',
    question: 'What is WCAG? Name three accessibility improvements you would make to a form.'
  },

  // ═══════════════════════════════════════════════════
  // FRONTEND DEVELOPER — Senior
  // ═══════════════════════════════════════════════════
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'Architecture',
    question: 'Describe how you would architect a large-scale micro-frontend application. What challenges arise and how do you address them?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'Performance',
    question: 'A page has a Time to Interactive (TTI) of 8 seconds. Walk me through your debugging and optimization process.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'React',
    question: 'How does React Fiber work and how does it improve scheduling of renders over the previous stack-based reconciler?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'React',
    question: 'Explain the useMemo and useCallback hooks. When is it actually worth using them?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'Security',
    question: 'What is Cross-Site Scripting (XSS)? How do you prevent it in a React application?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'System Design',
    question: 'Design a real-time collaborative text editor on the frontend. What libraries and strategies would you use?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'Testing',
    question: 'Describe your approach to end-to-end testing. How do you balance coverage with test maintenance cost?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'Mentorship',
    question: 'How do you establish and enforce frontend coding standards across a team of 10+ engineers?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'State Management',
    question: 'Explain how you would implement optimistic UI updates with rollback on error in a React/Redux application.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'CSS',
    question: 'How would you build a performant, accessible design system from scratch? What decisions matter most?'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'Build Tools',
    question: 'Compare Webpack and Vite in terms of bundling strategy, dev experience, and production output.'
  },
  {
    role: 'Frontend Developer', difficulty: 'Senior', category: 'Browser Internals',
    question: 'Walk me through what happens from typing a URL to a page being fully interactive.'
  },

  // ═══════════════════════════════════════════════════
  // BACKEND DEVELOPER — Entry-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'APIs',
    question: 'What is a REST API? What are the key HTTP methods and when do you use each?'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'APIs',
    question: 'What is the difference between a 400 and a 500 HTTP status code?'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'Databases',
    question: 'What is the difference between SQL and NoSQL databases? Give an example of each.'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'Databases',
    question: 'What is a primary key and a foreign key in a relational database?'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'Node.js',
    question: 'What is Node.js and how does its non-blocking I/O model work?'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'Node.js',
    question: 'What is Express.js? How do you create a simple route that returns JSON?'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'Authentication',
    question: 'What is the difference between authentication and authorization?'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'General',
    question: 'What is middleware in Express.js? Give a real-world example of when you would write custom middleware.'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'Databases',
    question: 'What is an ORM? Name one and explain the advantage it provides over raw SQL queries.'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'APIs',
    question: 'What is JSON? Why is it the dominant data format for REST APIs?'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'Version Control',
    question: 'Explain what a git merge conflict is and how you resolve one.'
  },
  {
    role: 'Backend Developer', difficulty: 'Entry-Level', category: 'General',
    question: 'What is the purpose of environment variables and why should secrets not be hardcoded?'
  },

  // ═══════════════════════════════════════════════════
  // BACKEND DEVELOPER — Mid-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Databases',
    question: 'What is database indexing? How does an index improve query performance, and what is the trade-off?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Databases',
    question: 'Explain database transactions and the ACID properties.'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Authentication',
    question: 'How does JWT-based authentication work? What are the security considerations?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Architecture',
    question: 'What is the difference between a monolith and a microservices architecture? When would you choose each?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Performance',
    question: 'What is caching? Describe how you would implement Redis caching for a frequently accessed API endpoint.'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'APIs',
    question: 'What is rate limiting and how would you implement it in an Express.js application?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Queues',
    question: 'What is a message queue? When would you use one instead of a direct API call?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Testing',
    question: 'How do you write integration tests for a Node.js REST API?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Security',
    question: 'What is SQL injection? How do you prevent it in your backend code?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Databases',
    question: 'What is a N+1 query problem? How would you detect and fix it?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'APIs',
    question: 'Explain CORS. Why does it exist and how do you configure it correctly on a server?'
  },
  {
    role: 'Backend Developer', difficulty: 'Mid-Level', category: 'Node.js',
    question: 'How do streams work in Node.js and when would you use them over reading a file into memory?'
  },

  // ═══════════════════════════════════════════════════
  // BACKEND DEVELOPER — Senior
  // ═══════════════════════════════════════════════════
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'System Design',
    question: 'Design a URL shortening service (like bit.ly). Walk through data model, API design, and scaling strategy.'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Databases',
    question: 'How would you approach database sharding? What are the different sharding strategies and their trade-offs?'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Architecture',
    question: 'Explain the SAGA pattern for managing distributed transactions in a microservices environment.'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Performance',
    question: 'An API endpoint is responding in 3 seconds. Describe your end-to-end debugging and optimization approach.'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Security',
    question: 'Walk me through the OWASP Top 10. Which are most relevant to Node.js/Express APIs?'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Architecture',
    question: 'What is event sourcing? How does it differ from traditional CRUD data storage?'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Infrastructure',
    question: 'How would you design a zero-downtime deployment pipeline for a backend service?'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Databases',
    question: 'Compare read replicas, write-through cache, and CQRS as patterns for scaling read-heavy workloads.'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Observability',
    question: 'What is distributed tracing? How would you implement it across multiple microservices?'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Concurrency',
    question: 'Explain optimistic vs pessimistic locking. When would you choose each in a high-traffic application?'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'Leadership',
    question: 'How do you make a build-vs-buy decision for a new backend service capability?'
  },
  {
    role: 'Backend Developer', difficulty: 'Senior', category: 'System Design',
    question: 'Design a rate-limiting service that works across a distributed fleet of API servers.'
  },

  // ═══════════════════════════════════════════════════
  // FULL STACK ENGINEER — Entry-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'General',
    question: 'Explain the difference between client-side and server-side rendering.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'Databases',
    question: 'What is CRUD? Write pseudo-code for a simple CRUD operation on a user resource.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'APIs',
    question: 'What happens when a browser makes a fetch() request to an API? Walk through the full lifecycle.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'React',
    question: 'How do you fetch data from an API in a React component? Show a minimal code example.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'Node.js',
    question: 'Describe the folder structure you would use for a simple Express REST API.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'Authentication',
    question: 'How would you implement a basic login form that sends credentials to a backend API?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'HTML & CSS',
    question: 'What is semantic HTML? Give three examples of semantic elements and why they matter.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'General',
    question: 'What is version control and why is it important in a team development environment?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'Databases',
    question: 'What is MongoDB? How is it different from a relational database like PostgreSQL?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'JavaScript',
    question: 'Explain async/await in JavaScript. How does it simplify working with Promises?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'General',
    question: 'What is the MERN stack? Describe the role each technology plays.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Entry-Level', category: 'APIs',
    question: 'What is a 404 error and what would cause it when calling a backend API from React?'
  },

  // ═══════════════════════════════════════════════════
  // FULL STACK ENGINEER — Mid-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Authentication',
    question: 'How would you implement JWT refresh tokens alongside access tokens in a full-stack app?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Architecture',
    question: 'How do you handle CORS in a full-stack application where frontend and backend are on different origins?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'React',
    question: 'How do you manage global state in a full-stack React app? Compare Redux, Zustand, and React Query.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Databases',
    question: 'What are Mongoose schemas and validators? Give an example of a complex schema with validations.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Performance',
    question: 'What is server-side rendering (SSR) and when would you use Next.js over a pure React SPA?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'APIs',
    question: 'What is GraphQL? How does it differ from REST and when would you choose it?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Testing',
    question: 'Describe your approach to testing a full-stack feature from database to UI.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'DevOps',
    question: 'How do you deploy a Node.js + React application? Walk through a CI/CD pipeline you have used.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Security',
    question: 'What are the top three security vulnerabilities you watch for in a full-stack application and how do you mitigate them?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'APIs',
    question: 'How do you handle and propagate backend errors consistently to the frontend?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Performance',
    question: 'Explain optimistic updates in a React application backed by a REST API.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Mid-Level', category: 'Real-Time',
    question: 'How would you add real-time notifications to a full-stack app? Compare WebSockets and Server-Sent Events.'
  },

  // ═══════════════════════════════════════════════════
  // FULL STACK ENGINEER — Senior
  // ═══════════════════════════════════════════════════
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'System Design',
    question: 'Design a full-stack e-commerce platform. Cover data model, API layer, frontend architecture, and scalability.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'Architecture',
    question: 'How would you migrate a monolithic full-stack app to a microservices architecture without downtime?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'Performance',
    question: 'How do you approach performance budgeting? What metrics do you track and what tools do you use?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'React',
    question: 'How does React Server Components change the full-stack rendering model? What trade-offs does it introduce?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'Security',
    question: 'Describe a comprehensive authentication and authorization strategy for a multi-tenant SaaS application.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'Observability',
    question: 'What observability stack would you build for a production full-stack application? Include logging, metrics, and tracing.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'Leadership',
    question: 'How do you lead a team of frontend and backend specialists to deliver a complex feature with minimal integration bugs?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'Databases',
    question: 'How do you decide between a relational and document database for a new full-stack project?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'APIs',
    question: 'How would you version a public API without breaking existing clients?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'DevOps',
    question: 'Walk me through your ideal infrastructure-as-code setup for a production full-stack deployment on AWS or GCP.'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'Architecture',
    question: 'What is the Strangler Fig pattern and how does it apply to modernising a legacy full-stack application?'
  },
  {
    role: 'Full Stack Engineer', difficulty: 'Senior', category: 'System Design',
    question: 'Design a real-time collaborative document editing feature (Google Docs-like). What challenges arise and how do you handle conflicts?'
  },

  // ═══════════════════════════════════════════════════
  // DATA SCIENTIST — Entry-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Statistics',
    question: 'What is the difference between supervised and unsupervised learning?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Statistics',
    question: 'Explain the difference between mean, median, and mode. When would median be more useful than mean?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Machine Learning',
    question: 'What is overfitting in a machine learning model? How do you detect and prevent it?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Python',
    question: 'What are pandas DataFrames? Describe three common operations you perform during data cleaning.'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Machine Learning',
    question: 'Explain what a train/test split is and why it is necessary.'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Statistics',
    question: 'What is a normal distribution? Why is it important in statistics?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Machine Learning',
    question: 'What is linear regression? When is it an appropriate model to use?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Data Wrangling',
    question: 'How do you handle missing data in a dataset? What are the trade-offs of each approach?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Python',
    question: 'What is NumPy and how does it complement pandas for data science work?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Visualization',
    question: 'What is Matplotlib? Describe when you would use a histogram versus a scatter plot.'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'Statistics',
    question: 'What is a p-value and what does statistical significance mean in practice?'
  },
  {
    role: 'Data Scientist', difficulty: 'Entry-Level', category: 'General',
    question: 'What is the difference between classification and regression problems?'
  },

  // ═══════════════════════════════════════════════════
  // DATA SCIENTIST — Mid-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Machine Learning',
    question: 'Explain the bias-variance trade-off and how it influences model selection.'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Machine Learning',
    question: 'What is cross-validation? Describe k-fold cross-validation and why it provides a better estimate than a single train-test split.'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Machine Learning',
    question: 'Explain gradient boosting. How does it differ from random forests?'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Evaluation',
    question: 'What metrics would you use to evaluate a binary classification model on an imbalanced dataset?'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Feature Engineering',
    question: 'What is feature engineering? Give three examples of transformations that improved a model you worked on.'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Deep Learning',
    question: 'What is a neural network? Describe forward propagation and back-propagation in simple terms.'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'NLP',
    question: 'What is TF-IDF? How does it differ from bag-of-words for text representation?'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Statistics',
    question: 'How do you run an A/B test and determine if the results are statistically significant?'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Python',
    question: 'What is scikit-learn? Walk me through the typical pipeline you build with it.'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Data Wrangling',
    question: 'Describe how you would detect and handle outliers in a real-world dataset.'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'SQL',
    question: 'Write a SQL query to find the top 5 customers by revenue for each region, using window functions.'
  },
  {
    role: 'Data Scientist', difficulty: 'Mid-Level', category: 'Machine Learning',
    question: 'What is regularisation? Explain L1 (Lasso) and L2 (Ridge) regularisation and when you would use each.'
  },

  // ═══════════════════════════════════════════════════
  // DATA SCIENTIST — Senior
  // ═══════════════════════════════════════════════════
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Deep Learning',
    question: 'Explain the Transformer architecture. Why did it replace RNNs as the dominant architecture for NLP?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'MLOps',
    question: 'What is model drift? How do you monitor for it and what triggers a retraining pipeline?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'System Design',
    question: 'Design a recommendation engine for a streaming platform. Cover data collection, modelling, and serving at scale.'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Causal Inference',
    question: 'What is causal inference and how does it differ from predictive modelling? Give an example where the distinction matters.'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'MLOps',
    question: 'Describe an end-to-end MLOps pipeline you have built or designed. What tools did you use and why?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Statistics',
    question: 'How do you design and analyze a multi-variate experiment? How do you handle interaction effects?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Machine Learning',
    question: 'Explain attention mechanisms and self-attention. How are they used in large language models?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Ethics',
    question: 'How do you detect and mitigate bias in a machine learning model that impacts hiring decisions?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Feature Engineering',
    question: 'How do you approach feature selection at scale when you have thousands of candidate features?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Leadership',
    question: 'How do you communicate model uncertainty and limitations to non-technical stakeholders to prevent misuse?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'Deep Learning',
    question: 'What are the key considerations when fine-tuning a large pre-trained language model for a domain-specific task?'
  },
  {
    role: 'Data Scientist', difficulty: 'Senior', category: 'System Design',
    question: 'Design a fraud detection system. How would you handle the class imbalance, latency requirements, and explainability needs?'
  },

  // ═══════════════════════════════════════════════════
  // PRODUCT MANAGER — Entry-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Product Sense',
    question: 'What is a product roadmap and what is your role in creating one?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Metrics',
    question: 'What metrics would you track to measure the success of a new feature launch?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'User Research',
    question: 'How would you conduct a user interview? What questions would you ask and what are you looking for?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Prioritization',
    question: 'You have 10 feature requests and capacity for 3. How do you decide which to build?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Agile',
    question: 'What is a user story? Write a user story for a "forgot password" feature.'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Product Sense',
    question: 'What is the difference between a feature and a product? Give an example of each.'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Stakeholders',
    question: 'How do you work with engineers who say a feature will take 3 months but the business needs it in 1 month?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Agile',
    question: 'What is a sprint? Describe what happens in a sprint planning meeting.'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Metrics',
    question: 'What is NPS (Net Promoter Score)? What are its limitations?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'Product Sense',
    question: 'How would you improve the onboarding experience for a new user of a productivity app?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'User Research',
    question: 'What is the difference between qualitative and quantitative user research? When would you use each?'
  },
  {
    role: 'Product Manager', difficulty: 'Entry-Level', category: 'General',
    question: 'Describe a product you use every day. What would you change about it and why?'
  },

  // ═══════════════════════════════════════════════════
  // PRODUCT MANAGER — Mid-Level
  // ═══════════════════════════════════════════════════
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Strategy',
    question: 'How do you define a product vision and ensure the team stays aligned with it during execution?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Metrics',
    question: 'What is a North Star Metric? How do you choose one and guard against gaming it?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Prioritization',
    question: 'Explain the RICE scoring model. What are its limitations in practice?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Analytics',
    question: 'Walk me through how you would investigate a 20% drop in daily active users.'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Experimentation',
    question: 'How do you design and evaluate an A/B test? What common mistakes do PMs make when running experiments?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Stakeholders',
    question: 'How do you manage conflicting priorities between engineering, design, and business stakeholders?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Product Sense',
    question: 'How would you design a feature to increase retention for a subscription-based app?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Go-to-Market',
    question: 'Walk me through how you would plan and execute the launch of a new product feature.'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Competitive Analysis',
    question: 'How do you approach competitive analysis and incorporate it into product decisions?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Technical',
    question: 'How much technical knowledge does a PM need? How do you communicate effectively with an engineering team?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'User Research',
    question: 'How do you validate a product hypothesis before committing engineering resources to build it?'
  },
  {
    role: 'Product Manager', difficulty: 'Mid-Level', category: 'Ethics',
    question: 'A high-impact feature would significantly increase engagement metrics but may harm user wellbeing. How do you decide?'
  },

  // ═══════════════════════════════════════════════════
  // PRODUCT MANAGER — Senior
  // ═══════════════════════════════════════════════════
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Strategy',
    question: 'How do you build a long-term product strategy that balances innovation with core product stability?'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Leadership',
    question: 'How do you build and maintain alignment across multiple product teams working on interdependent features?'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Analytics',
    question: 'Design the data and analytics infrastructure you would want as a senior PM managing a portfolio of products.'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Monetization',
    question: 'How do you balance growth, retention, and monetization when they create conflicting incentives?'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Strategy',
    question: 'Walk me through how you would identify a new market opportunity and build a business case for pursuing it.'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Leadership',
    question: 'How do you mentor junior PMs and build a strong product management culture within an organisation?'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Crisis Management',
    question: 'A major bug is causing data loss for 5% of users. You are the PM on call. Walk me through how you respond.'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Product Sense',
    question: 'How would you redesign Google Maps for a specific user segment that is currently underserved?'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Stakeholders',
    question: 'How do you say no to a CEO-level stakeholder who is pushing for a feature you believe is wrong for the product?'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Platform',
    question: 'What is the difference between a product and a platform strategy? Give an example of when you would build a platform instead of a product.'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'AI/ML',
    question: 'How are you thinking about integrating AI/ML capabilities into your product roadmap responsibly?'
  },
  {
    role: 'Product Manager', difficulty: 'Senior', category: 'Metrics',
    question: 'Design a metrics framework for a two-sided marketplace. How do you measure health for both supply and demand sides?'
  },
];

// ─── Seed Function ───────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log('\n🌱 InterviewAI — Seed Script');
    console.log('━'.repeat(50));

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Import model
    const { default: Question } = await import('../models/Question.js');

    // Clear existing questions
    const deleted = await Question.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing questions`);

    // Insert all questions
    const inserted = await Question.insertMany(questions);
    console.log(`✅ Inserted ${inserted.length} questions\n`);

    // Summary by role + difficulty
    const roles = [...new Set(questions.map(q => q.role))];
    const difficulties = ['Entry-Level', 'Mid-Level', 'Senior'];

    console.log('📊 Seeded Question Counts:');
    console.log('─'.repeat(50));
    for (const role of roles) {
      for (const diff of difficulties) {
        const count = questions.filter(q => q.role === role && q.difficulty === diff).length;
        console.log(`   ${role} / ${diff}: ${count} questions`);
      }
    }

    console.log('\n🎉 Seeding complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
