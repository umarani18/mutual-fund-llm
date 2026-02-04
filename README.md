"""README for Frontend"""

# Mutual Fund Suggestion System - Frontend

Modern Next.js frontend for the Mutual Fund Suggestion System.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Suggestions**: Get instant recommendations with AI-powered insights
- **Beautiful UI**: Tailwind CSS for professional appearance
- **Educational Focus**: Clear explanations and disclaimers throughout
- **Advanced Options**: Customize search with risk profile, time horizon, etc.

## Tech Stack

- **Next.js 14**: Modern React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hooks**: State management

## Project Structure

```
frontend/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── SearchForm.js      # Search input form
│   ├── RecommendationsList.js  # Results display
│   ├── LoadingSpinner.js  # Loading indicator
│   ├── Header.js          # Navigation header
│   └── Footer.js          # Footer component
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Setup & Installation

### Requirements

- Node.js 16+ and npm/yarn

### Installation Steps

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## API Integration

The frontend communicates with the FastAPI backend via these endpoints:

- `POST /api/v1/suggest` - Get mutual fund recommendations
- `GET /api/v1/mutual-funds` - List available funds
- `GET /api/v1/fund-details/{code}` - Get fund details
- `GET /api/v1/categories` - Get fund categories
- `GET /health` - Health check

## Features Breakdown

### SearchForm Component
- Text input for investment goals
- Investment amount field
- Risk profile selector
- Time horizon selector
- Advanced options for preferences
- Form validation

### RecommendationsList Component
- Displays up to 3 recommendations
- Shows fund metrics and performance
- Highlights key features
- Risk level indicators
- Educational explanations
- Disclaimer section

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px (md) for tablets
- Breakpoints at 1024px (lg) for desktop
- Optimized for all screen sizes

## Styling

Using Tailwind CSS utility classes for:
- Responsive grid layouts
- Card-based design
- Color-coded risk levels
- Smooth animations and transitions
- Gradient backgrounds

## Key Sections

1. **Hero Section**: Introduces the tool
2. **Search Section**: User input form
3. **Results Section**: Displays recommendations
4. **How It Works**: Educational explanation
5. **Footer**: Links and disclaimers

## Important Notes

- Educational tool only - not financial advice
- Always include disclaimer
- All recommendations are suggestions
- Link to qualified financial advisors
- Clear data source attribution

## Future Enhancements

- User feedback system
- Saved preferences
- Portfolio comparison
- Historical performance charts
- Fund comparison tools
- Mobile app version
