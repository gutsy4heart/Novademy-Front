import apiClient from '../api/apiClient';

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface SubscriptionRequest {
  userId: string;
  packageId: string;
}

/**
 * Get active subscriptions for a user
 */
export const getActiveSubscriptions = async (userId: string): Promise<Subscription[]> => {
  try {
    const response = await apiClient.get(`/subscription/active/${userId}`);
    return response.data as Subscription[];
  } catch (error: any) {
    throw new Error(`Failed to fetch active subscriptions: ${error.message}`);
  }
};

/**
 * Subscribe a user to a package
 */
export const subscribe = async (data: SubscriptionRequest): Promise<string> => {
  try {
    const response = await apiClient.post('/subscription', data);
    return response.data as string;
  } catch (error: any) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

/**
 * Check if a user has an active subscription for a specific package
 */
export const hasActiveSubscriptionForPackage = async (userId: string, packageId: string): Promise<boolean> => {
  try {
    const subscriptions = await getActiveSubscriptions(userId);
    return subscriptions.some(sub => sub.packageId === packageId && sub.isActive);
  } catch (error: any) {
    throw new Error(`Failed to check subscription status: ${error.message}`);
  }
}; 