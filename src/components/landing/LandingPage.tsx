import React, { useState } from 'react';
import { Shield, Zap, Award, Check, X, ArrowRight, Facebook, Users, Calendar, MessageSquare, Target, DollarSign, PieChart, BarChart3, ChevronDown, HelpCircle, Play, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onTabChange: (tab: string) => void;
}

export default function LandingPage({ onTabChange }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const renderHeroSection = () => (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Supercharge Your Insurance Business
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              InsureCRM helps insurance agents manage leads, track policies, and grow their business with powerful analytics and automation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => onTabChange('signup')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Start Your Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-lg font-medium">
                Schedule a Demo
              </button>
            </div>
            <div className="mt-8 flex items-center text-gray-500">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>No credit card required</span>
              <span className="mx-3">•</span>
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>7-day free trial</span>
              <span className="mx-3">•</span>
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 rounded-3xl transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Insurance Agent Dashboard" 
              className="relative rounded-3xl shadow-xl z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );

  const renderPricingSection = () => (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for your business. All plans include a 7-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Agent Essentials Plan */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900">Agent Essentials</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">Free</span>
                <span className="ml-2 text-gray-500">for 7 days</span>
              </div>
              <p className="mt-2 text-gray-600">
                Perfect for trying out all features before committing.
              </p>
            </div>
            <div className="px-8 pb-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>All features included</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Lead management</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Policy tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Goal tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Commission tracking</span>
                </li>
              </ul>
              <button 
                onClick={() => onTabChange('signup')}
                className="mt-8 w-full px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Team Growth Plan */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform scale-105 z-10 border-2 border-blue-500">
            <div className="bg-blue-500 py-2">
              <p className="text-center text-white text-sm font-medium">MOST POPULAR</p>
            </div>
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900">Team Growth</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$59</span>
                <span className="ml-2 text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-600">
                Essential features for individual insurance agents.
              </p>
            </div>
            <div className="px-8 pb-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Lead management</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Policy tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Client communication tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Basic reporting</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Team collaboration</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Goal tracking</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Commission tracking</span>
                </li>
              </ul>
              <button 
                onClick={() => onTabChange('signup')}
                className="mt-8 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Pro
              </button>
            </div>
          </div>

          {/* Agency Scale Plan */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900">Agency Scale</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$89</span>
                <span className="ml-2 text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-gray-600">
                Complete access to all features for growing agencies.
              </p>
            </div>
            <div className="px-8 pb-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Goal tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Commission tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Custom reporting</span>
                </li>
              </ul>
              <button 
                onClick={() => onTabChange('signup')}
                className="mt-8 w-full px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Choose Ultimate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderTestimonialsSection = () => (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what insurance professionals like you have to say about InsureCRM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Sarah Thompson" 
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Sarah Thompson</h4>
                <p className="text-sm text-gray-600">Independent Agent</p>
              </div>
            </div>
            <p className="text-gray-600">
              "InsureCRM has transformed how I manage my insurance business. The lead tracking and policy management features have helped me increase my sales by 30% in just three months."
            </p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Michael Rodriguez" 
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Michael Rodriguez</h4>
                <p className="text-sm text-gray-600">Agency Owner</p>
              </div>
            </div>
            <p className="text-gray-600">
              "As an agency owner, the team collaboration features are invaluable. I can track my agents' performance, assign leads, and ensure nothing falls through the cracks."
            </p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Emily Davis" 
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Emily Davis</h4>
                <p className="text-sm text-gray-600">Life Insurance Specialist</p>
              </div>
            </div>
            <p className="text-gray-600">
              "The commission tracking feature alone is worth the price. I always know exactly what I've earned and what's in my pipeline. The analytics help me focus on the most profitable policies."
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderFaqSection = () => (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-600">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              question: "How does the 7-day free trial work?",
              answer: "You get full access to all features for 7 days. No credit card required. At the end of your trial, you can choose to subscribe to one of our plans or your account will be automatically downgraded to a limited version."
            },
            {
              question: "Can I switch plans later?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be immediately available. If you downgrade, the changes will take effect at the start of your next billing cycle."
            },
            {
              question: "Is there a limit to how many leads I can manage?",
              answer: "No, all plans include unlimited leads and policies. We believe in providing value without arbitrary limits."
            },
            {
              question: "How secure is my data?",
              answer: "We take security seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regular security audits to ensure your data is protected."
            },
            {
              question: "Can I import my existing client data?",
              answer: "Yes, we provide tools to import your existing client and policy data from CSV files or directly from several popular insurance management systems."
            },
            {
              question: "Do you offer discounts for annual billing?",
              answer: "Yes, we offer a 15% discount when you choose annual billing for any of our paid plans."
            }
          ].map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === `faq-${index}` ? null : `faq-${index}`)}
                className="w-full px-6 py-4 text-left focus:outline-none"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeFaq === `faq-${index}` ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              {activeFaq === `faq-${index}` && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      {renderHeroSection()}
      {renderPricingSection()}
      {renderTestimonialsSection()}
      {renderFaqSection()}
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Grow Your Insurance Business?</h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of insurance professionals who are using InsureCRM to manage their business more efficiently and close more deals.
          </p>
          <div className="mt-10">
            <button 
              onClick={() => onTabChange('signup')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Start Your Free Trial
            </button>
          </div>
          <p className="mt-6 text-blue-100">
            No credit card required. 7-day free trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-2xl font-bold text-white">InsureCRM</span>
              </div>
              <p className="mt-4 text-gray-400">
                The complete CRM solution for insurance professionals.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2025 InsureCRM. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}