export interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  userId: string;
  imageUrl: string;
  location: Location;
  severity: Severity;
  description: string;
  status: 'pending' | 'verified' | 'resolved' | 'rejected';
  createdAt: string;
  updated_at: string;
}
