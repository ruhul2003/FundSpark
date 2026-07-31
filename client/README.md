# FundSpark - Next-Gen Crowdfunding Platform

> **FundSpark** is a high-impact, credit-based crowdfunding platform designed for Supporters, Creators, and Administrators to launch, fund, and manage global innovative projects with complete transparency and escrow protection.

---

## 🔑 Administrative Credentials & Live Links

- **Website Name**: FundSpark Crowdfunding Platform
- **Live Site URL**: `https://fundspark-crowdfund.vercel.app` (Placeholder for production deployment)
- **Admin Username / Email**: `admin@crowdspark.com`
- **Admin Password**: `Admin123!`
- **Client GitHub Repository**: `https://github.com/your-username/fundspark-client`
- **Server GitHub Repository**: `https://github.com/your-username/fundspark-server`

### Additional Demo Test Accounts
- **Creator Account**: `creator@crowdspark.com` | **Password**: `Creator123!` (20 default credits)
- **Supporter Account**: `supporter@crowdspark.com` | **Password**: `Supporter123!` (50 default credits)

---

## ⭐ 10 Key Notable Features

1. **Role-Based Registration & Credit Onboarding**: Supporters automatically receive **50 default credits** and Creators receive **20 default credits** upon initial registration to immediately participate in crowdfunding.
2. **Interactive Swiper Hero & Testimonial Sliders**: Dynamic banner carousel showcasing featured initiatives, alongside a community testimonial slider with user photos, ratings, and quotes.
3. **Top 6 Funded Campaigns Showcase**: Real-time display of top-performing campaigns based on total credits raised, with progress visualizers and category tags.
4. **Creator Campaign Moderation & Review**: Creators review pending backer pledges in a dedicated dashboard table, with options to **Approve** (adds to campaign raised & creator earnings) or **Reject** (refunds credits back to supporter).
5. **Campaign Deletion Escrow Refund System**: Deleting a campaign automatically refunds all approved pledge credits back to the respective supporters' accounts with instant system notifications.
6. **20:1 Credit-to-Dollar Payout Converter**: Creators can withdraw earnings at a fixed rate of **20 Credits = $1 Dollar** once reaching the 200 credit ($10 minimum) threshold via Stripe, Bkash, Nagad, or Bank Wire.
7. **Stripe Credit Purchase Integration**: Supporters can purchase credit packages (100 credits for $10, 300 for $25, 800 for $60, 1500 for $110) powered by Stripe elements.
8. **Floating Pop-up Notification System**: Real-time pop-up notification bell displaying personalized status updates (approvals, rejections, payouts) that automatically auto-closes on outside click.
9. **Server-Side Pagination on My Contributions**: Clean tabular view of supporter pledge history featuring server-controlled pagination buttons (`Page X of Y`).
10. **Suspicious Campaign Fraud Reporting**: Supporters can flag fraudulent campaigns, allowing Administrators to review details, suspend active listings, or clean up bad actors.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TailwindCSS, Framer Motion, Swiper, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM), JWT Authentication, Bcrypt.js, Stripe SDK.
- **Image Uploads**: ImgBB API with direct client fallback URL handling.

---

## 🚀 Local Installation & Setup

### 1. Clone & Install Client (Next.js)
```bash
cd crowdfund-platform/client
npm install
npm run dev
# Running on http://localhost:3000 (or http://localhost:5173)
```

### 2. Clone & Install Server (Node/Express)
```bash
cd crowdfund-platform/server
npm install
npm run dev
# Running on http://localhost:5000
```
