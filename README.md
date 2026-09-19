# FundSpark — Next-Generation Crowdfunding & Credit Escrow Platform

FundSpark is a full-stack, production-grade crowdfunding platform designed for creators, supporters, and platform administrators. Powered by Next.js, Express, MongoDB, and Stripe, FundSpark enables transparent credit-based campaign funding, interactive community engagement, backer reward fulfillment, and escrow security.

---

## Architecture & Technology Stack

### Frontend (`client/`)
- **Framework**: Next.js 16 (Turbopack, App Router)
- **UI & State**: React 18, Framer Motion, Tailwind CSS
- **Icons**: Lucide React
- **Theme**: Seamless Light and Dark mode parity with ThemeContext
- **Payments**: Stripe React SDK

### Backend (`server/`)
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing, Google OAuth2
- **Payments**: Stripe API SDK

---

## Core Feature Highlights

### 1. Credit Escrow & Campaign Funding
- Pledges are securely locked in platform escrow until campaigns conclude or are reviewed.
- Automatic credit refund mechanism if a campaign is rejected, canceled, or removed.

### 2. Bookmarks & Saved Campaigns
- Interactive bookmark heart buttons on Explore campaign cards and Campaign details.
- Dedicated `/dashboard/saved-campaigns` view to manage followed projects with quick support links.
- Backed by dedicated MongoDB `Bookmark` model with compound index optimization.

### 3. Campaign Social Sharing
- Interactive `ShareModal` supporting direct sharing to X (Twitter), LinkedIn, Facebook, and WhatsApp.
- One-click direct link copy to clipboard with instant visual confirmation badge.

### 4. Frequently Asked Questions (FAQ) Accordion
- Interactive FAQ section on campaign details clarifying credit backing, escrow protection, refund policies, and reward delivery timelines.

### 5. Backers Leaderboard & Community Showcase
- Live backer list for each campaign showing total backers, credits raised, and top 3 contributors podium.
- Supporter encouragement messages displayed alongside contribution amounts.

### 6. Account Settings & Profile Management
- Accessible via `/dashboard/profile` for all roles (Supporters, Creators, Admins).
- Update display name, avatar photo URL (with 5 quick presets), and bio.
- Secure password change form with current password verification and bcrypt encryption.

### 7. Advanced Explore Page Filters
- Live search by title or story with instant clear button.
- Category filtering: Technology, Environment, Education, Health, Art, Community.
- Funding goal ranges: Any Goal, < 500, 500–2,000, > 2,000 Credits.
- Campaign status toggle: Active Fundraising vs 100% Funded.
- One-click "Reset Filters" action.

### 8. Backer Data CSV Export for Creators
- Creators can export all approved backer contributions from `MyCampaigns` into formatted CSV spreadsheets (`[Campaign_Title]_backers.csv`) for easy reward shipping.

### 9. Notification Center & Read Management
- Floating notification popover with real-time polling.
- "Mark all as read" batch update (`PATCH /api/notifications/read-all`).
- Instant unread filter toggle (All vs Unread).
- Individual notification read tracking on click.

### 10. Interactive Credit Impact Calculator
- Interactive slider on the Pricing page allowing users to estimate campaign funding power, bulk discounts (10%–20% off), and unlocked perks.

### 11. Custom 404 & Global Error Handling
- Branded 404 page (`client/src/app/not-found.jsx`) with direct links to Explore and Home.
- Next.js Error Boundary (`client/src/app/error.jsx`) providing graceful retry capabilities.

### 12. Full Theme Parity
- High-contrast, responsive dark and light mode across all dashboard homepages, navigation, modals, and tables.

---

## API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new account (Supporter / Creator) |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/google-login` | Authenticate with Google credential |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session |

### Campaigns (`/api/campaigns`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/campaigns` | List active approved campaigns (search, filter, sort) |
| `GET` | `/api/campaigns/top` | Top 6 funded campaigns for homepage |
| `GET` | `/api/campaigns/:id` | Get campaign details by ID |
| `POST` | `/api/campaigns` | Submit new campaign (Creator, requires approval) |
| `PUT` | `/api/campaigns/:id` | Update campaign story, title, rewards |
| `DELETE` | `/api/campaigns/:id` | Delete campaign and refund supporters |
| `PATCH` | `/api/campaigns/:id/status` | Approve or reject campaign (Admin) |

### Bookmarks (`/api/bookmarks`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bookmarks` | List all saved campaigns for current user |
| `GET` | `/api/bookmarks/check/:campaignId` | Check if campaign is saved by user |
| `POST` | `/api/bookmarks/:campaignId` | Toggle bookmark (save / unsave) |

### Contributions (`/api/contributions`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contributions` | Pledge credits to a campaign |
| `GET` | `/api/contributions/campaign/:id/backers` | Public backers showcase & leaderboard |
| `PATCH` | `/api/contributions/:id/approve` | Approve backer contribution (Creator) |
| `PATCH` | `/api/contributions/:id/reject` | Reject and refund contribution (Creator) |

### Users & Settings (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/api/users/profile` | Update user name, photo, bio, phone |
| `PUT` | `/api/users/change-password` | Update account password |
| `GET` | `/api/users` | List all platform users (Admin) |
| `PATCH` | `/api/users/:id/role` | Update user role (Admin) |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | Get user notifications list |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read |
| `PATCH` | `/api/notifications/:id/read` | Mark single notification as read |

---

## Local Development Setup

### 1. Server Setup
```bash
cd server
npm install
npm run dev
```
*Server runs on `http://localhost:5000`*

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
*Client runs on `http://localhost:3000`*

---

## Verification & Build
To build the client application for production:
```bash
cd client
npx next build
```
