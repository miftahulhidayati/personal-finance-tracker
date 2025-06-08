# Personal Finance Tracker

A comprehensive personal finance management application built with Next.js 14, TypeScript, and Tailwind CSS. Features Google Sheets integration for data persistence and real-time financial tracking.

## Features

### 📊 Dashboard
- Monthly financial overview with interactive charts
- Income vs expenses tracking
- Budget progress visualization
- Asset allocation summary
- Real-time updates and refresh capabilities

### 💰 Budgeting
- Monthly budget allocation by category
- Yearly budget overview
- Income source management
- Category-based spending limits
- Progress tracking with visual indicators

### 💳 Spending Tracker
- Daily expense tracking
- Account balance management
- Transaction categorization
- Expense analysis and trends

### 🏦 Assets Management
- Liquid and non-liquid asset tracking
- Stock portfolio integration
- Cryptocurrency monitoring
- Gold and precious metals tracking
- Real-time price updates

### ⚙️ Settings
- User preferences configuration
- Data sync settings
- Notification preferences
- Theme customization

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with mobile-first design
- **State Management**: Zustand for global state
- **Charts**: Recharts for data visualization
- **Backend**: Google Sheets API v4 integration
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Development Guidelines

This project follows comprehensive development best practices and custom rules:

### Code Style
- **Indentation**: Tabs (not spaces)
- **Quotes**: Single quotes for strings
- **Semicolons**: Omitted (except when required)
- **Line Length**: 80 characters max
- **Naming**: PascalCase for components, kebab-case for files

### Component Architecture
- Functional components with TypeScript interfaces
- Custom hooks for reusable logic
- Proper error boundaries
- Accessibility-first design
- Mobile-responsive layouts

### Type Safety
- Strict TypeScript configuration
- Interface definitions for all data structures
- Type guards for runtime safety
- Generic types where appropriate

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn package manager
- Google Cloud Project with Sheets API enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure Google Sheets API:
   - Create a Google Cloud Project
   - Enable Google Sheets API
   - Create service account credentials
   - Add credentials to environment variables

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript compiler check

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page and layout
│   ├── budgeting/         # Budget management pages
│   ├── spending/          # Expense tracking pages
│   ├── assets/            # Asset management pages
│   └── settings/          # Settings pages
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form-related components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # External library configurations
├── stores/                # Zustand state stores
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## API Integration

### Google Sheets Structure

The application expects a Google Sheet with the following structure:

1. **MonthlyIncome** sheet - Income tracking
2. **BudgetCategories** sheet - Budget allocations
3. **Expenses** sheet - Daily expenses
4. **Assets** sheet - Asset portfolio
5. **BankAccounts** sheet - Account balances

### Environment Variables

Required environment variables:

```env
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-service-account-private-key
GOOGLE_SHEET_ID=your-google-sheet-id
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=your-app-url
```

## Contributing

1. Follow the established code style and naming conventions
2. Write comprehensive JSDoc documentation
3. Include proper TypeScript types
4. Ensure accessibility compliance
5. Add unit tests for new functionality
6. Update documentation as needed

## Accessibility

This application prioritizes accessibility:
- Semantic HTML structure
- ARIA attributes for screen readers
- Keyboard navigation support
- Color contrast compliance
- Focus management
- Alternative text for images

## Performance

- Server-side rendering with Next.js
- Image optimization
- Code splitting and lazy loading
- Efficient state management
- Optimized bundle size
- Fast refresh during development

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

For questions or issues, please create an issue in the repository or contact the development team.