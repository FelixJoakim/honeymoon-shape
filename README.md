# honeymoon.fit 💝

A beautiful fitness tracking app designed for couples preparing for their honeymoon. Built with React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration
- 📊 **Fitness Tracking** - Log workouts and track progress
- 🎯 **Goal Setting** - Set and track fitness goals
- 📈 **Progress Visualization** - Beautiful charts and stats
- 💑 **Couple Support** - Share progress with your partner
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for local Supabase)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd honeymoon.fit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local Supabase (optional)**
   ```bash
   npm run supabase:start
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

### Demo Credentials

For testing purposes, you can use:
- **Email:** fleminen@gmail.com
- **Password:** Kuntoon2026

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI
- **Backend:** Supabase (Auth, Database, Realtime)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── LoginForm.tsx   # Authentication
│   └── ...
├── utils/              # Utility functions
│   └── supabase/       # Supabase configuration
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:status` - Check Supabase status

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Deploy automatically on push

### Environment Variables

For production deployment, set these environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💖 Made with Love

Built with love for couples preparing for their special honeymoon! 🌴✈️

Visit us at: **honeymoon.fit**