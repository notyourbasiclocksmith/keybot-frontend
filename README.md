# KeyBot Frontend

React + Next.js frontend for KeyBot, connected to FastAPI backend.

## Features
- Customer quote management
- Audio recording upload and management
- Calendar for appointment scheduling
- Responsive and mobile-friendly design
- Global layout with navigation sidebar
- Skeleton loaders for improved UX during loading states

## Development
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_SPACES_BASE_URL=https://keybot-recordings.nyc3.digitaloceanspaces.com
```

## Built With
- Next.js
- React
- Tailwind CSS
- FullCalendar for appointment scheduling
- Axios for API requests
