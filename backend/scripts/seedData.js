const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('../models/User');
const MembershipPlan = require('../models/MembershipPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const NutritionPlan = require('../models/NutritionPlan');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding'))
.catch(err => console.log('MongoDB Connection Error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await MembershipPlan.deleteMany({});
    await WorkoutPlan.deleteMany({});
    await NutritionPlan.deleteMany({});
    const Booking = require('../models/Booking');
    await Booking.deleteMany({});

    console.log('Cleared existing data');

    // Create admin users
    const adminUser = await User.create({
      name: 'Alex Thompson',
      email: 'admin@fitgym.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      phone: '+1-555-0001',
      address: '100 Admin Plaza, Fitness City',
      joinDate: new Date('2023-01-15')
    });

    const adminUser2 = await User.create({
      name: 'Maria Rodriguez',
      email: 'maria@fitgym.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      phone: '+1-555-0002',
      address: '101 Admin Plaza, Fitness City',
      joinDate: new Date('2023-02-01')
    });

    // Create trainer users with specializations
    const trainers = await User.create([
      {
        name: 'James Wilson',
        email: 'james@fitgym.com',
        password: 'trainer123',
        role: 'trainer',
        isActive: true,
        phone: '+1-555-0101',
        address: '201 Trainer Lane, Fitness City',
        specialization: 'Strength Training',
        experience: '8 years',
        certifications: ['NASM-CPT', 'CSCS'],
        joinDate: new Date('2022-03-15')
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@fitgym.com',
        password: 'trainer123',
        role: 'trainer',
        isActive: true,
        phone: '+1-555-0102',
        address: '202 Trainer Lane, Fitness City',
        specialization: 'Yoga & Flexibility',
        experience: '6 years',
        certifications: ['RYT-500', 'Pilates Instructor'],
        joinDate: new Date('2022-05-20')
      },
      {
        name: 'Michael Chen',
        email: 'michael@fitgym.com',
        password: 'trainer123',
        role: 'trainer',
        isActive: true,
        phone: '+1-555-0103',
        address: '203 Trainer Lane, Fitness City',
        specialization: 'HIIT & Cardio',
        experience: '5 years',
        certifications: ['ACSM-CPT', 'HIIT Specialist'],
        joinDate: new Date('2022-07-10')
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@fitgym.com',
        password: 'trainer123',
        role: 'trainer',
        isActive: true,
        phone: '+1-555-0104',
        address: '204 Trainer Lane, Fitness City',
        specialization: 'Nutrition & Wellness',
        experience: '7 years',
        certifications: ['NASM-CNC', 'Precision Nutrition'],
        joinDate: new Date('2022-04-01')
      },
      {
        name: 'David Martinez',
        email: 'david@fitgym.com',
        password: 'trainer123',
        role: 'trainer',
        isActive: true,
        phone: '+1-555-0105',
        address: '205 Trainer Lane, Fitness City',
        specialization: 'Rehabilitation & Recovery',
        experience: '10 years',
        certifications: ['Physical Therapist', 'Corrective Exercise Specialist'],
        joinDate: new Date('2021-11-15')
      }
    ]);

    // Create member users with diverse profiles
    const members = await User.create([
      {
        name: 'Emma Thompson',
        email: 'emma@example.com',
        password: 'member123',
        role: 'member',
        isActive: true,
        phone: '+1-555-0201',
        address: '301 Member Street, Fitness City',
        joinDate: new Date('2023-06-15'),
        membershipStatus: 'active'
      },
      {
        name: 'Robert Kim',
        email: 'robert@example.com',
        password: 'member123',
        role: 'member',
        isActive: true,
        phone: '+1-555-0202',
        address: '302 Member Street, Fitness City',
        joinDate: new Date('2023-07-20'),
        membershipStatus: 'active'
      },
      {
        name: 'Jessica Brown',
        email: 'jessica@example.com',
        password: 'member123',
        role: 'member',
        isActive: true,
        phone: '+1-555-0203',
        address: '303 Member Street, Fitness City',
        joinDate: new Date('2023-08-10'),
        membershipStatus: 'active'
      },
      {
        name: 'Daniel Wilson',
        email: 'daniel@example.com',
        password: 'member123',
        role: 'member',
        isActive: true,
        phone: '+1-555-0204',
        address: '304 Member Street, Fitness City',
        joinDate: new Date('2023-09-05'),
        membershipStatus: 'active'
      },
      {
        name: 'Sophie Davis',
        email: 'sophie@example.com',
        password: 'member123',
        role: 'member',
        isActive: true,
        phone: '+1-555-0205',
        address: '305 Member Street, Fitness City',
        joinDate: new Date('2023-10-12'),
        membershipStatus: 'active'
      },
      {
        name: 'Alex Johnson',
        email: 'alexj@example.com',
        password: 'member123',
        role: 'member',
        isActive: true,
        phone: '+1-555-0206',
        address: '306 Member Street, Fitness City',
        joinDate: new Date('2023-11-01'),
        membershipStatus: 'pending'
      },
      {
        name: 'Maria Garcia',
        email: 'mariag@example.com',
        password: 'member123',
        role: 'member',
        isActive: true,
        phone: '+1-555-0207',
        address: '307 Member Street, Fitness City',
        joinDate: new Date('2023-11-15'),
        membershipStatus: 'pending'
      },
      {
        name: 'Kevin Lee',
        email: 'kevin@example.com',
        password: 'member123',
        role: 'member',
        isActive: false,
        phone: '+1-555-0208',
        address: '308 Member Street, Fitness City',
        joinDate: new Date('2023-12-01'),
        membershipStatus: 'active'
      }
    ]);

    console.log('Created users');

    // Create comprehensive membership plans
    const membershipPlans = await MembershipPlan.create([
      {
        name: 'Starter Plan',
        price: 19,
        duration: 'monthly',
        description: 'Perfect for fitness beginners who want to start their journey',
        features: [
          'Access to gym equipment',
          'Locker room access',
          'Basic group classes',
          'Gym app access',
          'Free Wi-Fi'
        ],
        maxTrainings: 0,
        includesPersonalTraining: false,
        includesNutritionPlan: false,
        includesLocker: true,
        includesSauna: false,
        isActive: true
      },
      {
        name: 'Basic Plan',
        price: 39,
        duration: 'monthly',
        description: 'Great value plan with essential fitness features',
        features: [
          'Everything in Starter Plan',
          '2 personal training sessions',
          'Basic nutrition guidance',
          'Sauna access',
          'Priority equipment booking'
        ],
        maxTrainings: 2,
        includesPersonalTraining: true,
        includesNutritionPlan: false,
        includesLocker: true,
        includesSauna: true,
        isActive: true
      },
      {
        name: 'Premium Plan',
        price: 69,
        duration: 'monthly',
        description: 'Most popular plan with comprehensive fitness support',
        features: [
          'Everything in Basic Plan',
          '4 personal training sessions',
          'Custom nutrition plan',
          'Advanced group classes',
          'Priority booking',
          'Nutrition consultation',
          'Guest pass (1 per month)'
        ],
        maxTrainings: 4,
        includesPersonalTraining: true,
        includesNutritionPlan: true,
        includesLocker: true,
        includesSauna: true,
        isActive: true
      },
      {
        name: 'Elite Plan',
        price: 99,
        duration: 'monthly',
        description: 'Ultimate fitness experience with unlimited training and premium amenities',
        features: [
          'Everything in Premium Plan',
          'Unlimited personal training',
          'Advanced nutrition tracking',
          'VIP locker room',
          'Guest passes (2 per month)',
          'Monthly body composition analysis',
          'Priority equipment access',
          '24/7 gym access'
        ],
        maxTrainings: null, // unlimited
        includesPersonalTraining: true,
        includesNutritionPlan: true,
        includesLocker: true,
        includesSauna: true,
        isActive: true
      },
      {
        name: 'Student Plan',
        price: 25,
        duration: 'monthly',
        description: 'Special discounted plan for students with valid ID',
        features: [
          'Everything in Basic Plan',
          '1 personal training session',
          'Student group classes',
          'Study area access',
          'Academic year membership'
        ],
        maxTrainings: 1,
        includesPersonalTraining: true,
        includesNutritionPlan: false,
        includesLocker: true,
        includesSauna: false,
        isActive: true
      },
      {
        name: 'Senior Plan',
        price: 35,
        duration: 'monthly',
        description: 'Tailored plan for seniors (65+) with specialized programs',
        features: [
          'Everything in Basic Plan',
          'Senior-specific classes',
          'Low-impact exercise options',
          'Health monitoring',
          'Flexible scheduling'
        ],
        maxTrainings: 2,
        includesPersonalTraining: true,
        includesNutritionPlan: false,
        includesLocker: true,
        includesSauna: true,
        isActive: true
      }
    ]);

    console.log('Created membership plans');

    // Assign membership plans to members
    members[0].membershipPlan = membershipPlans[2]._id; // Premium Plan
    members[0].membershipStatus = 'active';
    members[1].membershipPlan = membershipPlans[1]._id; // Basic Plan
    members[1].membershipStatus = 'active';
    members[2].membershipPlan = membershipPlans[3]._id; // Elite Plan
    members[2].membershipStatus = 'active';
    members[3].membershipPlan = membershipPlans[4]._id; // Student Plan
    members[3].membershipStatus = 'active';
    members[4].membershipPlan = membershipPlans[5]._id; // Senior Plan
    members[4].membershipStatus = 'active';
    members[5].pendingMembershipPlan = membershipPlans[1]._id; // Basic Plan
    members[5].membershipStatus = 'pending';
    members[6].pendingMembershipPlan = membershipPlans[2]._id; // Premium Plan
    members[6].membershipStatus = 'pending';
    members[7].membershipPlan = membershipPlans[0]._id; // Starter Plan
    members[7].membershipStatus = 'active';
    
    await Promise.all(members.map(member => member.save()));

    // Create comprehensive workout plans
    const workoutPlans = await WorkoutPlan.create([
      {
        title: 'Beginner Full Body Workout',
        description: 'A comprehensive full-body workout perfect for beginners. This routine targets all major muscle groups with basic exercises.',
        difficulty: 'beginner',
        duration: 45,
        exercises: [
          {
            name: 'Bodyweight Squats',
            sets: 3,
            reps: '12-15',
            weight: 'Body weight',
            restTime: '60 seconds',
            instructions: 'Stand with feet shoulder-width apart, lower down as if sitting in a chair, then return to standing.'
          },
          {
            name: 'Push-ups',
            sets: 3,
            reps: '8-12',
            weight: 'Body weight',
            restTime: '60 seconds',
            instructions: 'Start in plank position, lower chest to ground, push back up.'
          },
          {
            name: 'Lunges',
            sets: 3,
            reps: '10 each leg',
            weight: 'Body weight',
            restTime: '60 seconds',
            instructions: 'Step forward into lunge position, lower back knee toward ground, return to start.'
          },
          {
            name: 'Plank',
            sets: 3,
            reps: '30-45 seconds',
            weight: 'Body weight',
            restTime: '60 seconds',
            instructions: 'Hold plank position with straight body line from head to heels.'
          }
        ],
        targetMuscles: ['Legs', 'Chest', 'Shoulders', 'Core'],
        equipment: ['None'],
        createdBy: trainers[0]._id,
        category: 'strength'
      },

      {
        title: 'HIIT Cardio Blast',
        description: 'High-intensity interval training to boost cardiovascular fitness and burn calories efficiently.',
        difficulty: 'intermediate',
        duration: 30,
        exercises: [
          {
            name: 'Burpees',
            sets: 4,
            reps: '30 seconds',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'Squat down, jump back to plank, do push-up, jump feet forward, jump up with arms overhead.'
          },
          {
            name: 'Mountain Climbers',
            sets: 4,
            reps: '30 seconds',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'In plank position, rapidly alternate bringing knees to chest.'
          },
          {
            name: 'Jump Squats',
            sets: 4,
            reps: '30 seconds',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'Perform regular squat, then explode up into a jump.'
          },
          {
            name: 'High Knees',
            sets: 4,
            reps: '30 seconds',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'Run in place, bringing knees up to hip level.'
          }
        ],
        targetMuscles: ['Full Body', 'Cardiovascular'],
        equipment: ['None'],
        createdBy: trainers[2]._id,
        category: 'hiit'
      },
      {
        title: 'Upper Body Strength',
        description: 'Build upper body strength with this comprehensive workout targeting chest, back, shoulders, and arms.',
        difficulty: 'intermediate',
        duration: 60,
        exercises: [
          {
            name: 'Bench Press',
            sets: 4,
            reps: '8-10',
            weight: 'Barbell',
            restTime: '90 seconds',
            instructions: 'Lie on bench, lower bar to chest, press up to full extension.'
          },
          {
            name: 'Pull-ups',
            sets: 3,
            reps: '6-10',
            weight: 'Body weight',
            restTime: '90 seconds',
            instructions: 'Hang from bar, pull body up until chin clears bar, lower with control.'
          },
          {
            name: 'Overhead Press',
            sets: 3,
            reps: '8-12',
            weight: 'Dumbbells',
            restTime: '60 seconds',
            instructions: 'Press weights from shoulder level to overhead, lower with control.'
          },
          {
            name: 'Bent-over Rows',
            sets: 3,
            reps: '10-12',
            weight: 'Barbell',
            restTime: '60 seconds',
            instructions: 'Bend at hips, row bar to lower chest, squeeze shoulder blades.'
          }
        ],
        targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
        equipment: ['Barbell', 'Dumbbells', 'Bench', 'Pull-up Bar'],
        createdBy: trainers[0]._id,
        category: 'strength'
      },
      {
        title: 'Yoga Flow for Flexibility',
        description: 'Gentle yoga sequence to improve flexibility, balance, and mental well-being.',
        difficulty: 'beginner',
        duration: 50,
        exercises: [
          {
            name: 'Sun Salutation A',
            sets: 3,
            reps: '1 round',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'Complete sequence: mountain pose, forward fold, half lift, plank, chaturanga, upward dog, downward dog.'
          },
          {
            name: 'Warrior I',
            sets: 2,
            reps: '30 seconds each side',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'Step one foot forward, bend front knee, raise arms overhead, hold position.'
          },
          {
            name: 'Tree Pose',
            sets: 2,
            reps: '30 seconds each side',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'Stand on one leg, place other foot on inner thigh, bring hands to prayer position.'
          },
          {
            name: 'Child\'s Pose',
            sets: 1,
            reps: '2 minutes',
            weight: 'Body weight',
            restTime: 'None',
            instructions: 'Kneel down, sit back on heels, stretch arms forward, relax and breathe.'
          }
        ],
        targetMuscles: ['Full Body', 'Core', 'Balance'],
        equipment: ['Yoga Mat'],
        createdBy: trainers[1]._id,
        category: 'yoga'
      },
      {
        title: 'Senior-Friendly Strength',
        description: 'Low-impact strength training designed specifically for seniors to maintain muscle mass and bone density.',
        difficulty: 'beginner',
        duration: 40,
        exercises: [
          {
            name: 'Chair Squats',
            sets: 3,
            reps: '10-12',
            weight: 'Body weight',
            restTime: '60 seconds',
            instructions: 'Sit in chair, stand up using armrests for support if needed, sit back down slowly.'
          },
          {
            name: 'Wall Push-ups',
            sets: 3,
            reps: '8-10',
            weight: 'Body weight',
            restTime: '60 seconds',
            instructions: 'Stand facing wall, place hands on wall, perform push-up motion against wall.'
          },
          {
            name: 'Seated Leg Lifts',
            sets: 3,
            reps: '10 each leg',
            weight: 'Body weight',
            restTime: '45 seconds',
            instructions: 'Sit in chair, lift one leg straight out, hold briefly, lower slowly.'
          },
          {
            name: 'Arm Circles',
            sets: 2,
            reps: '10 each direction',
            weight: 'Body weight',
            restTime: '30 seconds',
            instructions: 'Stand with arms out to sides, make small circles forward and backward.'
          }
        ],
        targetMuscles: ['Legs', 'Arms', 'Core'],
        equipment: ['Chair', 'Wall'],
        createdBy: trainers[4]._id,
        category: 'flexibility'
      },
      {
        title: 'Advanced Powerlifting',
        description: 'Heavy compound movements for experienced lifters looking to build maximum strength.',
        difficulty: 'advanced',
        duration: 90,
        exercises: [
          {
            name: 'Deadlift',
            sets: 5,
            reps: '3-5',
            weight: 'Heavy Barbell',
            restTime: '3-5 minutes',
            instructions: 'Stand with feet hip-width apart, grip bar, lift by extending hips and knees simultaneously.'
          },
          {
            name: 'Squat',
            sets: 5,
            reps: '3-5',
            weight: 'Heavy Barbell',
            restTime: '3-5 minutes',
            instructions: 'Place bar on upper back, descend until thighs parallel to floor, drive up through heels.'
          },
          {
            name: 'Bench Press',
            sets: 5,
            reps: '3-5',
            weight: 'Heavy Barbell',
            restTime: '3-5 minutes',
            instructions: 'Lie on bench, lower bar to chest, press up to full extension with leg drive.'
          },
          {
            name: 'Overhead Press',
            sets: 4,
            reps: '5-8',
            weight: 'Heavy Barbell',
            restTime: '2-3 minutes',
            instructions: 'Press bar from shoulder level to overhead, maintain tight core throughout.'
          }
        ],
        targetMuscles: ['Full Body', 'Core'],
        equipment: ['Barbell', 'Bench', 'Squat Rack', 'Weight Plates'],
        createdBy: trainers[0]._id,
        category: 'strength'
      }
    ]);

    console.log('Created workout plans');

    // Create comprehensive nutrition plans
    const nutritionPlans = await NutritionPlan.create([
      {
        title: 'Weight Loss Nutrition Plan',
        description: 'A balanced nutrition plan designed to support healthy weight loss while maintaining energy levels.',
        targetCalories: 1500,
        meals: [
          {
            name: 'Greek Yogurt Parfait',
            calories: 300,
            protein: 20,
            carbs: 35,
            fat: 8,
            ingredients: ['Greek yogurt', 'Berries', 'Granola', 'Honey'],
            instructions: 'Layer yogurt, berries, and granola in a bowl. Drizzle with honey.',
            mealType: 'breakfast'
          },
          {
            name: 'Grilled Chicken Salad',
            calories: 400,
            protein: 35,
            carbs: 20,
            fat: 15,
            ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil'],
            instructions: 'Grill chicken, chop vegetables, toss with olive oil and lemon.',
            mealType: 'lunch'
          },
          {
            name: 'Baked Salmon with Vegetables',
            calories: 450,
            protein: 40,
            carbs: 25,
            fat: 20,
            ingredients: ['Salmon fillet', 'Broccoli', 'Sweet potato', 'Olive oil', 'Herbs'],
            instructions: 'Bake salmon with herbs, roast vegetables with olive oil.',
            mealType: 'dinner'
          },
          {
            name: 'Apple with Almond Butter',
            calories: 200,
            protein: 6,
            carbs: 25,
            fat: 12,
            ingredients: ['Apple', 'Almond butter'],
            instructions: 'Slice apple and serve with almond butter.',
            mealType: 'snack'
          }
        ],
        createdBy: trainers[3]._id,
        category: 'weight_loss',
        duration: 30
      },
      {
        title: 'Muscle Building Nutrition Plan',
        description: 'High-protein nutrition plan to support muscle growth and recovery.',
        targetCalories: 2500,
        meals: [
          {
            name: 'Protein Pancakes',
            calories: 500,
            protein: 35,
            carbs: 45,
            fat: 15,
            ingredients: ['Protein powder', 'Oats', 'Eggs', 'Banana', 'Berries'],
            instructions: 'Blend ingredients, cook as pancakes, top with berries.',
            mealType: 'breakfast'
          },
          {
            name: 'Turkey and Rice Bowl',
            calories: 600,
            protein: 45,
            carbs: 60,
            fat: 12,
            ingredients: ['Ground turkey', 'Brown rice', 'Vegetables', 'Sauce'],
            instructions: 'Cook turkey and rice, add vegetables and sauce.',
            mealType: 'lunch'
          },
          {
            name: 'Beef Stir-fry',
            calories: 550,
            protein: 40,
            carbs: 35,
            fat: 20,
            ingredients: ['Lean beef', 'Rice noodles', 'Vegetables', 'Soy sauce'],
            instructions: 'Stir-fry beef and vegetables, serve over noodles.',
            mealType: 'dinner'
          },
          {
            name: 'Protein Shake',
            calories: 300,
            protein: 25,
            carbs: 20,
            fat: 8,
            ingredients: ['Protein powder', 'Milk', 'Banana', 'Peanut butter'],
            instructions: 'Blend all ingredients until smooth.',
            mealType: 'snack'
          }
        ],
        createdBy: trainers[0]._id,
        category: 'muscle_gain',
        duration: 30
      },
      {
        title: 'Vegan Plant-Based Plan',
        description: 'Complete plant-based nutrition plan for vegans and those interested in plant-based eating.',
        targetCalories: 2000,
        meals: [
          {
            name: 'Overnight Oats',
            calories: 400,
            protein: 15,
            carbs: 60,
            fat: 12,
            ingredients: ['Oats', 'Almond milk', 'Chia seeds', 'Berries', 'Maple syrup'],
            instructions: 'Mix oats with almond milk and chia seeds, refrigerate overnight, top with berries.',
            mealType: 'breakfast'
          },
          {
            name: 'Quinoa Buddha Bowl',
            calories: 500,
            protein: 20,
            carbs: 70,
            fat: 15,
            ingredients: ['Quinoa', 'Chickpeas', 'Sweet potato', 'Kale', 'Tahini dressing'],
            instructions: 'Cook quinoa, roast sweet potato, massage kale, combine with chickpeas and dressing.',
            mealType: 'lunch'
          },
          {
            name: 'Lentil Curry',
            calories: 450,
            protein: 25,
            carbs: 50,
            fat: 18,
            ingredients: ['Red lentils', 'Coconut milk', 'Curry spices', 'Vegetables', 'Brown rice'],
            instructions: 'Cook lentils with coconut milk and spices, serve over brown rice.',
            mealType: 'dinner'
          },
          {
            name: 'Hummus with Veggies',
            calories: 200,
            protein: 8,
            carbs: 25,
            fat: 10,
            ingredients: ['Hummus', 'Carrot sticks', 'Cucumber', 'Bell peppers'],
            instructions: 'Serve hummus with fresh vegetable sticks.',
            mealType: 'snack'
          }
        ],
        createdBy: trainers[3]._id,
        category: 'maintenance',
        duration: 30
      },
      {
        title: 'Senior Health Plan',
        description: 'Nutrition plan designed for seniors focusing on bone health, heart health, and maintaining muscle mass.',
        targetCalories: 1800,
        meals: [
          {
            name: 'Oatmeal with Berries',
            calories: 350,
            protein: 12,
            carbs: 55,
            fat: 8,
            ingredients: ['Steel-cut oats', 'Blueberries', 'Walnuts', 'Greek yogurt'],
            instructions: 'Cook oats, top with berries, nuts, and yogurt.',
            mealType: 'breakfast'
          },
          {
            name: 'Mediterranean Salad',
            calories: 400,
            protein: 20,
            carbs: 30,
            fat: 25,
            ingredients: ['Mixed greens', 'Olive oil', 'Feta cheese', 'Olives', 'Tomatoes'],
            instructions: 'Toss greens with olive oil, add feta, olives, and tomatoes.',
            mealType: 'lunch'
          },
          {
            name: 'Baked Fish with Vegetables',
            calories: 450,
            protein: 35,
            carbs: 25,
            fat: 20,
            ingredients: ['White fish', 'Broccoli', 'Carrots', 'Olive oil', 'Herbs'],
            instructions: 'Bake fish with herbs, roast vegetables with olive oil.',
            mealType: 'dinner'
          },
          {
            name: 'Cheese and Crackers',
            calories: 200,
            protein: 10,
            carbs: 20,
            fat: 8,
            ingredients: ['Whole grain crackers', 'Cheese', 'Apple slices'],
            instructions: 'Serve crackers with cheese and apple slices.',
            mealType: 'snack'
          }
        ],
        createdBy: trainers[4]._id,
        category: 'maintenance',
        duration: 30
      }
    ]);

    console.log('Created nutrition plans');

    // Assign workout and nutrition plans to members
    members[0].workouts = [workoutPlans[0]._id, workoutPlans[1]._id];
    members[0].nutritionPlan = nutritionPlans[0]._id;
    members[1].workouts = [workoutPlans[2]._id];
    members[1].nutritionPlan = nutritionPlans[1]._id;
    members[2].workouts = [workoutPlans[4]._id];
    members[2].nutritionPlan = nutritionPlans[1]._id;
    members[3].workouts = [workoutPlans[0]._id];
    members[3].nutritionPlan = nutritionPlans[0]._id;
    members[4].workouts = [workoutPlans[3]._id];
    members[4].nutritionPlan = nutritionPlans[3]._id;
    
    await Promise.all(members.map(member => member.save()));

    console.log('Assigned plans to members');

    // Create comprehensive sample bookings
    
    const sampleBookings = [
      {
        memberId: members[0]._id,
        trainerId: trainers[0]._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        time: '10:00',
        duration: 60,
        status: 'confirmed',
        sessionType: 'personal_training',
        notes: 'Focus on upper body strength',
        price: 50
      },
      {
        memberId: members[0]._id,
        trainerId: trainers[2]._id,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: '14:00',
        duration: 45,
        status: 'pending',
        sessionType: 'personal_training',
        notes: 'HIIT cardio session',
        price: 45
      },
      {
        memberId: members[1]._id,
        trainerId: trainers[1]._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        time: '16:00',
        duration: 60,
        status: 'completed',
        sessionType: 'personal_training',
        notes: 'Yoga and flexibility',
        price: 50
      },
      {
        memberId: members[2]._id,
        trainerId: trainers[0]._id,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        time: '09:00',
        duration: 90,
        status: 'confirmed',
        sessionType: 'personal_training',
        notes: 'Advanced powerlifting session',
        price: 75
      },
      {
        memberId: members[3]._id,
        trainerId: trainers[2]._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: '15:00',
        duration: 45,
        status: 'pending',
        sessionType: 'personal_training',
        notes: 'Student fitness assessment',
        price: 35
      },
      {
        memberId: members[4]._id,
        trainerId: trainers[4]._id,
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        time: '11:00',
        duration: 40,
        status: 'confirmed',
        sessionType: 'personal_training',
        notes: 'Senior-friendly strength training',
        price: 40
      }
    ];

    await Booking.insertMany(sampleBookings);
    console.log('Created sample bookings');

    console.log('✅ Enhanced seed data created successfully!');
    console.log('\n📋 Created:');
    console.log('- 2 Admin users (admin@fitgym.com, maria@fitgym.com / admin123)');
    console.log('- 5 Trainer users with specializations (james@fitgym.com, sarah@fitgym.com, michael@fitgym.com, lisa@fitgym.com, david@fitgym.com / trainer123)');
    console.log('- 8 Member users with diverse profiles (emma@example.com, robert@example.com, jessica@example.com, daniel@example.com, sophie@example.com, alexj@example.com, mariag@example.com, kevin@example.com / member123)');
    console.log('- 6 Membership plans (Starter, Basic, Premium, Elite, Student, Senior)');
    console.log('- 6 Workout plans (Beginner, HIIT, Upper Body, Yoga, Senior, Powerlifting)');
    console.log('- 4 Nutrition plans (Weight Loss, Muscle Gain, Vegan, Senior)');
    console.log('- 6 Sample bookings with various statuses');
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@fitgym.com / admin123');
    console.log('Trainer: james@fitgym.com / trainer123');
    console.log('Member: emma@example.com / member123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();
