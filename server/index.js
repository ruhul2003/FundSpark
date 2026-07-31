const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database connection
connectDB();

// Seed initial database content if empty
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial system users...');
      const salt = await bcrypt.genSalt(10);
      const adminPass = await bcrypt.hash('Admin123!', salt);
      const creatorPass = await bcrypt.hash('Creator123!', salt);
      const supporterPass = await bcrypt.hash('Supporter123!', salt);

      const admin = await User.create({
        name: 'Platform Administrator',
        email: 'admin@crowdspark.com',
        password: adminPass,
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'Admin',
        credits: 1000
      });

      const creator = await User.create({
        name: 'Alex Rivera (Tech Innovator)',
        email: 'creator@crowdspark.com',
        password: creatorPass,
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        role: 'Creator',
        credits: 20,
        raisedCredits: 450
      });

      const supporter = await User.create({
        name: 'Elena Rostova',
        email: 'supporter@crowdspark.com',
        password: supporterPass,
        photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        role: 'Supporter',
        credits: 50
      });

      console.log('Default Seed Users Created successfully!');

      // Seed Initial Approved Campaigns
      await Campaign.create([
        {
          title: 'SolarFlow: Portable Clean Water Purifier',
          story: 'SolarFlow uses multi-stage UV filtration powered by solar energy to provide 500 liters of pure drinking water daily in rural communities.',
          category: 'Technology',
          fundingGoal: 1200,
          amountRaised: 850,
          minContribution: 20,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          rewardInfo: 'SolarFlow Founders Tech Kit & Digital Supporter Certificate',
          imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
          creatorEmail: creator.email,
          creatorName: creator.name,
          status: 'approved'
        },
        {
          title: 'EcoPack: 100% Biodegradable Marine Packaging',
          story: 'Replacing harmful ocean plastics with organic algae-based food packaging that dissolves harmlessly in seawater within 48 hours.',
          category: 'Environment',
          fundingGoal: 2000,
          amountRaised: 1450,
          minContribution: 15,
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          rewardInfo: 'Sample EcoPack Home Starter Set & Custom Enamel Pin',
          imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
          creatorEmail: creator.email,
          creatorName: creator.name,
          status: 'approved'
        },
        {
          title: 'AuraSound: Open-Ear Bone Conduction Headphones',
          story: 'Next-gen audio clarity with ambient noise perception, built for urban cyclists and runners seeking safety and sound precision.',
          category: 'Technology',
          fundingGoal: 1500,
          amountRaised: 920,
          minContribution: 25,
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          rewardInfo: 'Early Bird AuraSound Headset + Premium Carrying Case',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          creatorEmail: creator.email,
          creatorName: creator.name,
          status: 'approved'
        },
        {
          title: 'Horizon VR: Interactive STEM Learning Worlds',
          story: 'Bringing interactive high school biology and physics laboratories to virtual reality headsets worldwide for under-resourced schools.',
          category: 'Education',
          fundingGoal: 3000,
          amountRaised: 2100,
          minContribution: 30,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          rewardInfo: 'Lifetime All-Access School License & VR Classroom Pass',
          imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
          creatorEmail: creator.email,
          creatorName: creator.name,
          status: 'approved'
        },
        {
          title: 'BioShield: Organic Urban Farming Greenhouses',
          story: 'Empowering urban neighborhoods to cultivate nutrient-rich microgreens with self-regulating smart hydroponic mini-farm beds.',
          category: 'Community',
          fundingGoal: 800,
          amountRaised: 640,
          minContribution: 10,
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          rewardInfo: 'Hydroponic Starter Seed Pods & Urban Farming E-Book',
          imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
          creatorEmail: creator.email,
          creatorName: creator.name,
          status: 'approved'
        },
        {
          title: 'PulseCare: Portable ECG & Vital Monitor',
          story: 'Affordable pocket-sized medical monitor transmitting real-time heart metrics directly to emergency care physicians.',
          category: 'Health',
          fundingGoal: 2500,
          amountRaised: 1800,
          minContribution: 50,
          deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
          rewardInfo: 'First Edition PulseCare Unit + 2 Years Cloud Sync',
          imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
          creatorEmail: creator.email,
          creatorName: creator.name,
          status: 'approved'
        }
      ]);
      console.log('Default Seed Campaigns Created successfully!');
    }
  } catch (err) {
    console.error('Seed Error:', err.message);
  }
};

setTimeout(seedDatabase, 2000);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/contributions', require('./routes/contributions'));
app.use('/api/withdrawals', require('./routes/withdrawals'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stats', require('./routes/stats'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'FundSpark Crowdfunding Server Operational',
    version: '1.0.0',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
