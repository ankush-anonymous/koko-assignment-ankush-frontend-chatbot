/**
 * API utility functions for backend communication
 */

const getBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim() || '';
  if (baseUrl) {
    return baseUrl.replace(/\/+$/, '');
  }
  return '';
};

const getApiUrl = (endpoint: string): string => {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  if (baseUrl) {
    return `${baseUrl}/${cleanEndpoint}`;
  }
  return `/${cleanEndpoint}`;
};

export interface User {
  _id: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  sessionId: string;
  role: 'user' | 'bot';
  content: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  _id: string;
  userId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Fetch all users
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const url = getApiUrl('api/v1/users/getAllUsers');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const result: ApiResponse<User[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Fetch conversations (messages) for a specific user
 * GET /api/v1/messages/getConversationsByUserId/:userId
 */
export async function getConversationsByUserId(userId: string): Promise<Message[]> {
  try {
    const url = getApiUrl(`api/v1/messages/getConversationsByUserId/${userId}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch conversations: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    
    // Handle different response formats
    // Format 1: { success: true, data: [...] }
    // Format 2: { data: [...] }
    // Format 3: Direct array [...]
    if (Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else if (result.messages && Array.isArray(result.messages)) {
      return result.messages;
    } else {
      console.warn('Unexpected response format:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const url = getApiUrl(`api/v1/users/getByIdUser/${userId}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const result: ApiResponse<User> = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
