import apiClient from './api';

// Interfaces based on api_docs.json
export interface TalentRegistrationPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: 'talent';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  type: string;
  created_at: string;
  updated_at: string;
  email_verified_at?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const registerTalent = async (payload: TalentRegistrationPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/register', payload);
  return response.data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/login', payload);
  return response.data;
};

export const getUserProfile = async (token: string): Promise<User> => {
  const response = await apiClient.get<User>('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<User> => {
  const response = await apiClient.put<User>('/profile', payload);
  return response.data;
}; 