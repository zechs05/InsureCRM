import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, X, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Upload, CreditCard, Check, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { stripePromise } from '../../lib/stripe';

interface SignupProps {
  onTabChange: (tab: string) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  plan: 'starter' | 'pro' | 'ultimate';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const plans = [
  {
    id: 'starter',
    name: 'Agent Essentials',
    price: 0,
    description: 'Perfect for trying out all features before committing',
    features: [
      'All features included',
      'Lead management',
      'Policy tracking',
      'Team collaboration',
      'Goal tracking',
      'Analytics dashboard',
      'Commission tracking'
    ],
    priceId: null // Free trial plan
  },
  {
    id: 'pro',
    name: 'Team Growth',
    price: 59,
    description: 'Essential features for individual insurance agents',
    features: [
      'Lead management',
      'Policy tracking',
      'Client communication tools',
      'Basic reporting',
      'Team collaboration',
      'Goal tracking',
      'Advanced analytics',
      'Commission tracking'
    ],
    priceId: 'price_1QwyxmLri3d4hSPFKeugHM4b'
  },
  {
    id: 'ultimate',
    name: 'Agency Scale',
    price: 89,
    description: 'Complete access to all features for growing agencies',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Goal tracking',
      'Advanced analytics',
      'Commission tracking',
      'Priority support',
      'Custom reporting'
    ],
    priceId: 'price_1Qwyz6Lri3d4hSPF34ib4HbF'
  }
];

export default function Signup({ onTabChange }: SignupProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      plan: 'starter'
    }
  });

  const selectedPlan = watch('plan');

  const onSubmit = async (data: FormData) => {
    try {
      setSaving(true);
      setError(null);

      // Create Stripe payment method
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: data.cardNumber,
          exp_month: parseInt(data.cardExpiry.split('/')[0], 10),
          exp_year: parseInt(data.cardExpiry.split('/')[1], 10),
          cvc: data.cardCvc
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Sign up user with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            stripe_customer_id: null, // Will be updated after Stripe customer creation
            subscription_status: 'trialing',
            trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          }
        }
      });

      if (signUpError) throw signUpError;

      // Create Stripe customer and subscription
      const response = await fetch('/api/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          paymentMethodId: paymentMethod?.id,
          priceId: plans.find(p => p.id === data.plan)?.priceId,
          userId: authData.user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      setSuccess(true);
      setTimeout(() => {
        onTabChange('dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome aboard!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account has been created and your 7-day free trial has started. You'll be redirected to your dashboard in a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button 
          onClick={() => onTabChange('landing')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </button>
        <div className="flex justify-center">
          <Send className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => onTabChange('login')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="John Smith"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watch('password') || 'Passwords do not match'
                  })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Select Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register('plan')}
                      value={plan.id}
                      className="sr-only"
                    />
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-900">{plan.name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${plan.price}/mo
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {plan.id === 'starter' && (
                        <div className="mt-4 p-2 bg-blue-100 rounded text-xs text-blue-800">
                          7-day free trial included
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register('cardNumber', {
                        required: 'Card number is required',
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message: 'Please enter a valid card number'
                        }
                      })}
                      className="block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      {...register('cardExpiry', {
                        required: 'Expiry date is required',
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: 'Please enter a valid expiry date (MM/YY)'
                        }
                      })}
                      className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="MM/YY"
                    />
                    {errors.cardExpiry && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardExpiry.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      {...register('cardCvc', {
                        required: 'CVC is required',
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message: 'Please enter a valid CVC'
                        }
                      })}
                      className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="123"
                    />
                    {errors.cardCvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardCvc.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                By signing up, you agree to our Terms of Service and Privacy Policy. Your card will not be charged during the 7-day free trial. You can cancel anytime before the trial ends.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={saving}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  saving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Creating account...' : 'Start Free Trial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}