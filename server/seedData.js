const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Contribution = require('./models/Contribution');
const Withdrawal = require('./models/Withdrawal');
const Report = require('./models/Report');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hire_loop_db_user:wwiIRfECMOKwPwpl@tilux-server.cltfmst.mongodb.net/FundSpark?appName=Tilux-server';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI, { dbName: 'FundSpark' });
    console.log('Connected to FundSpark MongoDB Database!');

    // Clear existing data
    console.log('Clearing old database collections...');
    await User.deleteMany({});
    await Campaign.deleteMany({});
    await Contribution.deleteMany({});
    await Withdrawal.deleteMany({});
    await Report.deleteMany({});
    await Notification.deleteMany({});

    console.log('Seeding demo users...');
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

    const creator1 = await User.create({
      name: 'Alex Rivera (Tech Innovator)',
      email: 'creator@crowdspark.com',
      password: creatorPass,
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      role: 'Creator',
      credits: 50,
      raisedCredits: 850
    });

    const creator2 = await User.create({
      name: 'Sarah Jenkins (SolarTech)',
      email: 'sarah.jenkins@crowdspark.com',
      password: creatorPass,
      photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      role: 'Creator',
      credits: 30,
      raisedCredits: 1200
    });

    const creator3 = await User.create({
      name: 'Dr. Aris Thorne (VR Lead)',
      email: 'dr.thorne@crowdspark.com',
      password: creatorPass,
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      role: 'Creator',
      credits: 40,
      raisedCredits: 950
    });

    const supporter1 = await User.create({
      name: 'Elena Rostova',
      email: 'supporter@crowdspark.com',
      password: supporterPass,
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      role: 'Supporter',
      credits: 150
    });

    const supporter2 = await User.create({
      name: 'Michael Vance',
      email: 'michael.vance@crowdspark.com',
      password: supporterPass,
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      role: 'Supporter',
      credits: 80
    });

    console.log('Users created successfully!');

    console.log('Seeding demo campaigns...');
    const campaigns = await Campaign.create([
      {
        title: 'SolarFlow: Portable Clean Water Purifier',
        story: 'SolarFlow uses multi-stage UV filtration powered by solar energy to provide 500 liters of pure drinking water daily in rural communities without electricity access.',
        category: 'Technology',
        fundingGoal: 1200,
        amountRaised: 850,
        minContribution: 20,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        rewardInfo: 'SolarFlow Founders Tech Kit & Digital Supporter Certificate',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator2.email,
        creatorName: creator2.name,
        status: 'approved'
      },
      {
        title: 'EcoPack: 100% Biodegradable Marine Packaging',
        story: 'Replacing harmful single-use ocean plastics with organic algae-based food packaging that dissolves harmlessly in seawater within 48 hours without microplastics.',
        category: 'Environment',
        fundingGoal: 1500,
        amountRaised: 1100,
        minContribution: 15,
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        rewardInfo: 'Sample EcoPack Sample Box & Sustainability Member Badge',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator1.email,
        creatorName: creator1.name,
        status: 'approved'
      },
      {
        title: 'EduVR: Open Source STEM Classrooms for Rural Schools',
        story: 'Distributing affordable standalone VR headsets pre-loaded with interactive science and physics experiments for students in underfunded schools.',
        category: 'Education',
        fundingGoal: 2000,
        amountRaised: 1450,
        minContribution: 25,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        rewardInfo: 'Virtual Classroom Access Pass & Annual STEM Sponsor Recognition',
        imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator3.email,
        creatorName: creator3.name,
        status: 'approved'
      },
      {
        title: 'BioBreathe: Low-Cost Medical Oxygen Concentrator Kit',
        story: 'An open-hardware medical grade oxygen concentrator built from locally sourced materials to aid remote clinics during emergency health crises.',
        category: 'Health',
        fundingGoal: 1800,
        amountRaised: 920,
        minContribution: 20,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        rewardInfo: 'BioBreathe Technical Blueprint PDF & Contributor Plaque',
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator1.email,
        creatorName: creator1.name,
        status: 'approved'
      },
      {
        title: 'PulseCanvas: Interactive Community Art Wall Installation',
        story: 'Constructing an interactive LED-based public wall sculpture that responds dynamically to urban soundscapes and pedestrian footsteps.',
        category: 'Art',
        fundingGoal: 800,
        amountRaised: 640,
        minContribution: 10,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        rewardInfo: 'Personalized LED Engraving & VIP Launch Pass',
        imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator3.email,
        creatorName: creator3.name,
        status: 'approved'
      },
      {
        title: 'GreenCanopy: Urban Rooftop Micro-Farms Initiative',
        story: 'Transforming unused city rooftops into high-yield hydroponic micro-farms to supply fresh organic produce directly to local food banks.',
        category: 'Community',
        fundingGoal: 1000,
        amountRaised: 780,
        minContribution: 15,
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        rewardInfo: 'Organic Farm Basket & Roof Garden Membership Card',
        imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator2.email,
        creatorName: creator2.name,
        status: 'approved'
      },
      {
        title: 'OceanClean: Autonomous Trash-Collecting Wave Drone',
        story: 'Solar-powered aquatic autonomous drone engineered to skim surface plastic and micro-litter from harbor waterways before reaching open oceans.',
        category: 'Environment',
        fundingGoal: 3000,
        amountRaised: 1500,
        minContribution: 30,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        rewardInfo: 'Ocean Clean Fleet Supporter Model & Digital Telemetry Dashboard',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator1.email,
        creatorName: creator1.name,
        status: 'approved'
      },
      {
        title: 'QuantumMesh: Off-Grid Mesh Emergency Network',
        story: 'Portable satellite-linked emergency mesh communication nodes designed for rapid disaster relief communications.',
        category: 'Technology',
        fundingGoal: 2500,
        amountRaised: 300,
        minContribution: 25,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        rewardInfo: 'QuantumMesh Testing Kit & Early Access Beta Node',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        creatorEmail: creator3.email,
        creatorName: creator3.name,
        status: 'pending'
      }
    ]);

    console.log('Campaigns created successfully!');

    console.log('Seeding demo contributions...');
    await Contribution.create([
      {
        campaignId: campaigns[0]._id,
        campaignTitle: campaigns[0].title,
        amount: 250,
        supporterEmail: supporter1.email,
        supporterName: supporter1.name,
        creatorEmail: creator2.email,
        creatorName: creator2.name,
        status: 'approved',
        message: 'Incredible work on clean water! Excited to see this deployed.'
      },
      {
        campaignId: campaigns[1]._id,
        campaignTitle: campaigns[1].title,
        amount: 300,
        supporterEmail: supporter2.email,
        supporterName: supporter2.name,
        creatorEmail: creator1.email,
        creatorName: creator1.name,
        status: 'approved',
        message: 'Replacing single-use ocean plastics is vital. Full support!'
      },
      {
        campaignId: campaigns[2]._id,
        campaignTitle: campaigns[2].title,
        amount: 200,
        supporterEmail: supporter1.email,
        supporterName: supporter1.name,
        creatorEmail: creator3.email,
        creatorName: creator3.name,
        status: 'pending',
        message: 'Great initiative for rural education!'
      }
    ]);

    console.log('Seeding demo withdrawals...');
    await Withdrawal.create([
      {
        creatorEmail: creator1.email,
        creatorName: creator1.name,
        withdrawalCredit: 400,
        withdrawalAmount: 20, // $20
        paymentSystem: 'Stripe',
        accountNumber: 'acct_1MockStripeCreatorAccount99',
        status: 'approved'
      },
      {
        creatorEmail: creator2.email,
        creatorName: creator2.name,
        withdrawalCredit: 600,
        withdrawalAmount: 30, // $30
        paymentSystem: 'Bkash',
        accountNumber: '01700123456',
        status: 'pending'
      }
    ]);

    console.log('Seeding demo reports & notifications...');
    await Report.create([
      {
        campaignId: campaigns[7]._id,
        campaignTitle: campaigns[7].title,
        reporterEmail: supporter2.email,
        reporterName: supporter2.name,
        reason: 'Verification needed for satellite link credentials.',
        status: 'pending'
      }
    ]);

    await Notification.create([
      {
        message: 'Welcome to FundSpark! You have 50 registration bonus credits available.',
        toEmail: supporter1.email,
        actionRoute: '/dashboard/supporter-home',
        isRead: false
      },
      {
        message: 'Your campaign "SolarFlow" received a new pledge of 250 credits!',
        toEmail: creator2.email,
        actionRoute: '/dashboard/creator-home',
        isRead: false
      }
    ]);

    console.log('All demo data seeded successfully into MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
