import React from 'react'
import { motion } from 'framer-motion'
import { 
  Dumbbell, 
  Users, 
  Award, 
  Heart, 
  Target, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react'
import Card from '../components/ui/Card'

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Health First',
      description: 'We prioritize your health and well-being above all else, providing safe and effective fitness solutions.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive community where everyone can achieve their fitness goals together.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to providing the highest quality service and facilities for our members.'
    },
    {
      icon: Target,
      title: 'Results',
      description: 'Focused on delivering real, measurable results for every member who walks through our doors.'
    }
  ]

  const stats = [
    { number: '15+', label: 'Years of Experience' },
    { number: '5000+', label: 'Happy Members' },
    { number: '50+', label: 'Expert Trainers' },
    { number: '24/7', label: 'Gym Access' }
  ]

  const features = [
    'State-of-the-art equipment',
    'Certified personal trainers',
    'Group fitness classes',
    'Nutrition counseling',
    'Locker rooms and showers',
    'Sauna and steam room',
    'Childcare services',
    'Free parking'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About FitGym
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-100">
              Your premier destination for fitness and wellness. We've been helping people 
              achieve their health goals for over 15 years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Founded in 2008, FitGym started as a small fitness center with a big dream: 
                to make fitness accessible and enjoyable for everyone. What began as a 
                single location has grown into a comprehensive fitness community.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our founders, both fitness enthusiasts and certified trainers, recognized 
                the need for a gym that combined state-of-the-art equipment with 
                personalized attention and a supportive community atmosphere.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Today, we continue to evolve and improve, always staying at the forefront 
                of fitness innovation while maintaining our core values of health, 
                community, and excellence.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-96 bg-primary-200 dark:bg-primary-800 rounded-2xl flex items-center justify-center">
                <Dumbbell className="w-24 h-24 text-primary-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              These core values guide everything we do and shape the experience 
              we provide to our members.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card hover className="text-center h-full">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-96 bg-primary-200 dark:bg-primary-800 rounded-2xl flex items-center justify-center">
                <Users className="w-24 h-24 text-primary-600" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                World-Class Facilities
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our state-of-the-art facilities are designed to provide you with 
                everything you need for a complete fitness experience. From the 
                latest equipment to comfortable amenities, we've thought of everything.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our certified trainers and staff are here to support you on your 
              fitness journey with expertise, motivation, and care.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: 'John Smith',
                role: 'Head Trainer',
                experience: '10+ years',
                specialties: ['Strength Training', 'Weight Loss', 'Rehabilitation']
              },
              {
                name: 'Sarah Johnson',
                role: 'Nutrition Specialist',
                experience: '8+ years',
                specialties: ['Nutrition Planning', 'Meal Prep', 'Sports Nutrition']
              },
              {
                name: 'Mike Chen',
                role: 'Group Fitness Instructor',
                experience: '6+ years',
                specialties: ['HIIT', 'Yoga', 'Pilates']
              }
            ].map((trainer, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card hover className="text-center">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">{trainer.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {trainer.experience} experience
                  </p>
                  <div className="space-y-1">
                    {trainer.specialties.map((specialty, specIndex) => (
                      <span
                        key={specIndex}
                        className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full mr-1 mb-1"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Become part of the FitGym family and start your journey to a healthier, 
              stronger you today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/register'}
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Join Now
              </button>
              <button
                onClick={() => window.location.href = '/plans'}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200"
              >
                View Plans
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
