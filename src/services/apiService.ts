import { CONFIG } from '../constants/config';
import { authService } from './authService';
import { Report } from '../types';
import { Platform } from 'react-native';

export const apiService = {
  async getHeaders() {
    const token = await authService.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async login(email: string, password: string) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    await authService.setToken(data.access_token);
    await authService.setUser(data.user);
    return data;
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async getIssues(userId?: string) {
    const url = userId 
      ? `${CONFIG.API_BASE_URL}/issues/?user_id=${userId}`
      : `${CONFIG.API_BASE_URL}/issues/`;
      
    const response = await fetch(url, {
      headers: await this.getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch issues');
    
    // Map backend Issue to frontend Report type
    return data.map((item: any) => ({
      id: item.id.toString(),
      userId: item.user_id.toString(),
      imageUrl: item.image_url,
      location: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
      severity: item.prediction === 'waterlogged' ? 'high' : 'low', // Simple mapping for now
      description: item.prediction,
      status: item.status,
      createdAt: item.created_at,
      updated_at: item.created_at,
    }));
  },

  async getMapIssues() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/issues/map`, {
      headers: await this.getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch map data');
    return data;
  },

  async createIssue(imageUri: string, location: { latitude: number; longitude: number }, prediction: string, confidence: number) {
    const formData = new FormData();

    // For Android, ensure the URI is properly formatted
    let cleanUri = imageUri;
    if (Platform.OS === 'android' && !imageUri.startsWith('file://') && !imageUri.startsWith('content://')) {
      cleanUri = `file://${imageUri}`;
    }

    // @ts-ignore
    formData.append('image', {
      uri: cleanUri,
      type: 'image/jpeg',
      name: 'report.jpg',
    });
    
    console.log('Sending issue to backend:', {
      uri: cleanUri,
      location,
      prediction,
      confidence
    });
    
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
    formData.append('prediction', prediction);
    formData.append('confidence', confidence.toString());

    const token = await authService.getToken();
    const response = await fetch(`${CONFIG.API_BASE_URL}/issues/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create issue');
    return data;
  }
};
