# SmartGov — Government Office Load Management System

A smart government office management portal built with **Next.js** and **React**. Features AI-powered crowd prediction, blockchain-secured transactions, smart token generation, and role-based dashboards for Citizens and Government Officers.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Lucide Icons
- **Styling:** Vanilla CSS with Libre Baskerville typography
- **Design:** Premium blue & silver palette with pixelated art aesthetic

## Getting Started

```bash
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.jsx              # Root layout (font imports)
│   ├── page.jsx                # Landing page
│   ├── globals.css             # Global styles & design system
│   ├── login/
│   │   └── page.jsx            # Login (Citizen / Employee toggle)
│   └── (dashboard)/            # Authenticated route group
│       ├── layout.jsx          # Dashboard layout wrapper
│       ├── admin/page.jsx      # Admin panel (approvals, stats)
│       ├── citizen/page.jsx    # Citizen portal (fees, certificates)
│       ├── dashboard/page.jsx  # Office load monitor
│       ├── document/page.jsx   # AI document verification
│       ├── officer/page.jsx    # Appointment booking
│       ├── token/page.jsx      # Smart token generation
│       └── transactions/page.jsx # Revenue & payment history
├── components/
│   └── Layout.jsx              # Sidebar + header layout
└── views/
    ├── Dashboard.jsx           # Crowd prediction & office heatmap
    ├── DocumentUpload.jsx      # AI document verification UI
    ├── OfficerScheduling.jsx   # Appointment booking UI
    └── TokenGeneration.jsx     # Smart token generation UI
```

## Features

### Citizen Portal
- Fee payment (Land Tax, Name Transfer, Nagar Nigam Tax)
- Certificate applications with document checklists
- AI Document Verification
- Smart token generation
- Appointment booking (Today / Tomorrow)

### Government Authority Portal
- Office load monitor with live heatmap
- Crowd prediction with hourly footfall graph
- Pending approvals & authorization system
- Revenue & transactions dashboard
- Queue management
