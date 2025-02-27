import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { stripePromise, updateSubscription, cancelSubscription } from '../../lib/stripe';

interface BillingSettingsProps {
  user: any;
}

export default function BillingSettings({ user }: BillingSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCard = async () => {
    try {
      setProcessing(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error: setupError } = await stripe.confirmCardSetup(
        subscription.setup_intent_client_secret,
        {
          payment_method: {
            card: elements.getElement('card'),
            billing_details: {
              name: user.user_metadata.full_name,
              email: user.email
            }
          }
        }
      );

      if (setupError) throw setupError;

      await fetchSubscription();
      setShowUpdateCard(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpgrade = async (newPriceId: string) => {
    try {
      setProcessing(true);
      setError(null);

      await updateSubscription(subscription.id, newPriceId);
      await fetchSubscription();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      setProcessing(true);
      setError(null);

      await cancelSubscription(subscription.id);
      await fetchSubscription();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Billing & Subscription</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and payment methods
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {subscription?.plan_name || 'Free Trial'}
                </p>
                <p className="text-sm text-gray-500">
                  ${subscription?.amount / 100}/month
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription?.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {subscription?.status === 'trialing' ? 'Trial' : 'Active'}
              </span>
            </div>
            {subscription?.trial_end && (
              <p className="mt-2 text-sm text-gray-500">
                Trial ends on {new Date(subscription.trial_end * 1000).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
          <div className="mt-4">
            {subscription?.card ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-900">
                    •••• •••• •••• {subscription.card.last4}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Expires {subscription.card.exp_month}/{subscription.card.exp_year}
                  </span>
                </div>
                <button
                  onClick={() => setShowUpdateCard(true)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Update
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowUpdateCard(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Add Payment Method
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
          <div className="mt-4">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscription?.invoices?.map((invoice: any) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.created * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount_paid / 100}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-500">
                        <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                          View Invoice
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Cancel Subscription</h3>
          <p className="mt-1 text-sm text-gray-500">
            You can cancel your subscription at any time. Your plan will remain active until the end of your current billing period.
          </p>
          <button
            onClick={handleCancel}
            disabled={processing}
            className="mt-4 inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}