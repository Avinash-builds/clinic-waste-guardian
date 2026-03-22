# Clinic Biomedical Waste Recycling Management System

## Abstract

A web-based system designed to streamline the safe handling, tracking, and recycling of biomedical waste for clinics, small hospitals, diagnostic centers, and waste recycling agencies.

## Features

- **Waste Entry & Tracking** – Categorize and record daily waste disposal data
- **Clinic Management** – Register clinics, manage profiles, and track compliance
- **Pickup Scheduling** – Clinics request pickups; admins schedule and confirm collection dates
- **Recycling Logs** – Track recyclable waste batches, processing, and reuse
- **Analytics & AI Insights** – Monthly summaries, category-wise statistics, and AI-powered recommendations
- **Role-Based Access** – Admin (waste management companies) and Clinic Staff roles
- **Notifications** – Real-time alerts for scheduled pickups, waste entries, and compliance
- **PDF Reports** – Generate and download disposal and scheduling reports

## Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **UI Components:** shadcn/ui, Recharts
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **PDF Generation:** jsPDF

## Getting Started

### Prerequisites

- Node.js & npm – [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

## System Workflow

1. Clinic staff logs in and records waste entries
2. Waste is categorized (Yellow, Red, Blue, White, Sharps)
3. Clinic requests a pickup schedule
4. Admin reviews, accepts, and schedules the pickup date
5. Disposal and recycling data are updated
6. Reports and analytics are generated
7. Notifications are sent for all key activities

## Database Tables

- `users` / `profiles` – User accounts and profile data
- `user_roles` – Role-based access (admin, moderator, clinic_staff)
- `clinics` – Registered clinic information
- `waste_categories` – Waste segregation categories
- `waste_records` – Daily waste entry logs
- `disposal_logs` – Disposal method and vendor tracking
- `recycling_logs` – Recycling batch processing records
- `pickup_schedules` – Collection scheduling and status
- `notifications` – System alerts and messages

## Modules

| Module | Description |
|--------|-------------|
| Authentication | Login/signup with role-based access |
| Dashboard | Overview stats, quick actions, recent records |
| Waste Entry | Record and track daily waste data |
| Clinics | Register and manage clinic profiles |
| Pickup Scheduling | Request, accept, and schedule waste collection |
| Recycling | Track recycling batches and processing |
| Analytics | Charts, trends, and AI-powered insights |
| Users | Manage system users and roles |
| Notifications | Real-time alerts and reminders |
| Settings | System configuration |
| Reports | Generate and download PDF reports |

## Future Enhancements

- Mobile app for field collection staff
- QR-code based waste bag tracking
- GPS tracking for transport vehicles
- Email notifications for pickup confirmations
- Multi-tenant cloud deployment

## License

This project is proprietary software. All rights reserved.
