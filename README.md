# DSA Tracker Pro

A comprehensive platform for tracking Data Structures and Algorithms progress with AI-powered insights and recommendations.

## Features

- **Progress Tracking**: Track solved problems by topic and difficulty
- **AI Assistant**: Get AI-powered explanations and personalized recommendations
- **Analytics Dashboard**: Comprehensive analytics with performance graphs
- **Authentication**: Secure user authentication with MongoDB Atlas
- **A/B Testing**: Personalized recommendations based on user behavior

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens with bcrypt password hashing
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

The app is deployed on Vercel with automatic deployments from GitHub.

---

*Updated with latest ESLint and TypeScript fixes for deployment*
