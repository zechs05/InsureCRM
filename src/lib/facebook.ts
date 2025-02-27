import { supabase } from './supabase';
import type { FacebookLead, FacebookConfig, Lead } from '../types';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const FACEBOOK_API_VERSION = 'v19.0';
const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

class FacebookLeadService {
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve, reject) => {
      const initSDK = () => {
        try {
          if (!window.FB) {
            throw new Error('Facebook SDK not loaded');
          }

          window.FB.init({
            appId: APP_ID,
            cookie: true,
            xfbml: true,
            version: FACEBOOK_API_VERSION
          });

          this.initialized = true;
          console.log('Facebook SDK initialized successfully');
          resolve();
        } catch (error) {
          console.error('Error initializing Facebook SDK:', error);
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`Retrying initialization (attempt ${this.retryCount}/${this.maxRetries})...`);
            setTimeout(initSDK, 1000 * Math.pow(2, this.retryCount));
          } else {
            reject(new Error('Failed to initialize Facebook SDK after multiple attempts'));
          }
        }
      };

      // Check if SDK script is already loaded
      if (document.getElementById('facebook-jssdk')) {
        initSDK();
        return;
      }

      // Load the SDK script
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = initSDK;
      script.onerror = () => reject(new Error('Failed to load Facebook SDK script'));
      document.head.appendChild(script);

      // Set timeout for SDK load
      setTimeout(() => {
        if (!this.initialized) {
          reject(new Error('Facebook SDK failed to load (timeout)'));
        }
      }, 10000);
    });

    return this.initPromise;
  }

  public async login(): Promise<string> {
    try {
      await this.initialize();

      return new Promise((resolve, reject) => {
        window.FB.login((response: any) => {
          if (response.authResponse) {
            console.log('Facebook login successful:', response);
            resolve(response.authResponse.accessToken);
          } else {
            console.error('Facebook login failed:', response);
            reject(new Error('Facebook login failed'));
          }
        }, {
          scope: 'leads_retrieval,pages_show_list,pages_read_engagement,ads_read'
        });
      });
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  }

  public async getPages(accessToken: string) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/accounts?access_token=${accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data[0];
    } catch (error) {
      console.error('Error getting Facebook pages:', error);
      throw error;
    }
  }

  public async getForms(accessToken: string, pageId: string) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${pageId}/leadgen_forms?access_token=${accessToken}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error getting lead forms:', error);
      throw error;
    }
  }

  public async saveConfig(config: Partial<FacebookConfig>) {
    try {
      const { error } = await supabase
        .from('facebook_config')
        .upsert({
          access_token: config.accessToken,
          page_id: config.pageId,
          form_id: config.formId,
          sync_interval: config.syncInterval || 5,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving Facebook configuration:', error);
      throw error;
    }
  }
}

export const facebookLeadService = new FacebookLeadService();