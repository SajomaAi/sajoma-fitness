import React from 'react';
import { Link } from 'react-router-dom';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="section hero-section" style={{ 
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%)',
        padding: '80px 0'
      }}>
        <div className="container">
          <div className="flex-container" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', padding: '0 20px' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--dark-color)' }}>
                Sajoma Fitness
              </h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--dark-color)' }}>
                Track meals, monitor health metrics, and receive expert-backed wellness suggestions tailored for your body's changing needs.
              </p>
              <div>
                <Link to="/login" className="btn mb-2 mr-2" style={{ marginRight: '1rem' }}>
                  Get Started
                </Link>
                <a href="#features" className="btn btn-secondary">
                  Learn More
                </a>
              </div>
            </div>
            <div style={{ flex: '1', padding: '0 20px', textAlign: 'center' }}>
              <img 
                src="/images/dashboard_screen.png" 
                alt="Sajoma Fitness App Dashboard" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">
            Sajoma Fitness combines cutting-edge technology with expert nutritional guidance to help adults achieve their wellness goals.
          </p>

          <div className="flex-container features-container" style={{ justifyContent: 'space-between' }}>
            {/* Feature 1 */}
            <div style={{ flex: '1', minWidth: '300px', padding: '20px' }}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <img 
                    src="/images/meal_logger_screen.png" 
                    alt="Meal Analysis" 
                    style={{ width: '80%', borderRadius: '8px' }} 
                  />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Meal Photo Analysis</h3>
                <p>
                  Simply take a photo of your meal and Sajoma Fitness identifies ingredients, analyzes nutritional content, and provides expert-backed suggestions.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ flex: '1', minWidth: '300px', padding: '20px' }}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <img 
                    src="/images/water_tracker_screen.png" 
                    alt="Water Tracking" 
                    style={{ width: '80%', borderRadius: '8px' }} 
                  />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Water Intake Tracking</h3>
                <p>
                  Track your daily water consumption with a simple tap-to-add interface. Stay hydrated with personalized reminders based on your activity level.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{ flex: '1', minWidth: '300px', padding: '20px' }}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <img 
                    src="/images/health_tracker_screen.png" 
                    alt="Health Tracking" 
                    style={{ width: '80%', borderRadius: '8px' }} 
                  />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Health Metrics Monitoring</h3>
                <p>
                  Monitor weight, mood, energy levels, and other key health indicators. Visualize trends and correlate them with your nutrition habits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ backgroundColor: 'var(--primary-light)' }}>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Sajoma Fitness makes wellness tracking simple and effective with a user-friendly approach designed for all adults.
          </p>

          <div className="flex-container" style={{ justifyContent: 'center' }}>
            {/* Step 1 */}
            <div className="how-it-works-step" style={{ flex: '1', maxWidth: '250px', padding: '20px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2rem', 
                margin: '0 auto 1.5rem' 
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Log Your Meals</h3>
              <p>
                Take a photo of your meal or log it manually to track your nutrition intake.
              </p>
            </div>

            {/* Step 2 */}
            <div className="how-it-works-step" style={{ flex: '1', maxWidth: '250px', padding: '20px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2rem', 
                margin: '0 auto 1.5rem' 
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Track Your Health</h3>
              <p>
                Monitor water intake, weight, mood, and energy levels to build a complete wellness profile.
              </p>
            </div>

            {/* Step 3 */}
            <div className="how-it-works-step" style={{ flex: '1', maxWidth: '250px', padding: '20px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2rem', 
                margin: '0 auto 1.5rem' 
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Get Insights</h3>
              <p>
                Receive personalized suggestions from nutrition experts like Dr. Berg and Dr. Gundry.
              </p>
            </div>

            {/* Step 4 */}
            <div className="how-it-works-step" style={{ flex: '1', maxWidth: '250px', padding: '20px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2rem', 
                margin: '0 auto 1.5rem' 
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Improve Daily</h3>
              <p>
                Make small, sustainable changes guided by your personal data and expert recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">
            Hear from adults who have transformed their wellness journey with Sajoma Fitness.
          </p>

          <div className="flex-container" style={{ justifyContent: 'center' }}>
            {/* Testimonial 1 */}
            <div className="testimonial-card" style={{ flex: '1', minWidth: '300px', maxWidth: '400px', padding: '20px' }}>
              <div className="card" style={{ height: '100%' }}>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "Sajoma Fitness has completely changed how I approach nutrition. The meal analysis feature helped me identify inflammatory foods that were causing my joint pain."
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary-color)', 
                    marginRight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    JM
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>Janet M.</p>
                    <p style={{ margin: 0, color: 'var(--text-gray)' }}>Age 52</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card" style={{ flex: '1', minWidth: '300px', maxWidth: '400px', padding: '20px' }}>
              <div className="card" style={{ height: '100%' }}>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "The water tracking feature is so simple yet effective. I've increased my daily water intake by 40% and my energy levels have improved dramatically."
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary-color)', 
                    marginRight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    RK
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>Robert K.</p>
                    <p style={{ margin: 0, color: 'var(--text-gray)' }}>Age 47</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card" style={{ flex: '1', minWidth: '300px', maxWidth: '400px', padding: '20px' }}>
              <div className="card" style={{ height: '100%' }}>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "As someone over 60, I appreciate how Sajoma Fitness is designed with simplicity in mind. The expert tips have helped me make better choices without feeling overwhelmed."
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary-color)', 
                    marginRight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    SL
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>Susan L.</p>
                    <p style={{ margin: 0, color: 'var(--text-gray)' }}>Age 63</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--dark-color) 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '80px 0'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
            Start Your Wellness Journey Today
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Join thousands of adults who are taking control of their health with Sajoma Fitness' personalized approach to wellness.
          </p>
          <Link to="/login" className="btn" style={{ 
            backgroundColor: 'white', 
            color: 'var(--primary-color)',
            padding: '15px 40px',
            fontSize: '1.2rem'
          }}>
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
