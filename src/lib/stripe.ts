import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_live_51QwyWZLri3d4hSPFCVMDPUN85ZotysKIeypmCCo07OqHXfwlOcMypE3H388xZ7nr4CZROQ4J3GBE4jNKkRRMym9F00LnuZ8X6I';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const createSubscription = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, newPriceId: string) => {
  try {
    const response = await fetch('/api/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        newPriceId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};