"use client";
import '../styles/HomePage.css';

// Import the new sections
import FeaturedTools from './FeaturedTools';
import BenefitsSection from './BenefitsSection';
import TestimonialsSection from './TestimonialsSection';
import NewsletterSection from './NewsletterSection';

const HomePage = () => {

  return (
    <div className="home-page">
      <FeaturedTools />
      <BenefitsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

export default HomePage;