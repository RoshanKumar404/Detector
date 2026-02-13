import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report } from '../types';

const REPORTS_KEY = '@detector_reports';

export const storageService = {
  async saveReport(report: Report): Promise<void> {
    try {
      const existingReports = await this.getAllReports();
      const updatedReports = [report, ...existingReports];
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  },

  async getAllReports(): Promise<Report[]> {
    try {
      const reportsJson = await AsyncStorage.getItem(REPORTS_KEY);
      if (!reportsJson) {
        // Initialize with one mock report on first run
        const mockReport: Report = {
          id: 'mock-1',
          userId: 'system',
          imageUrl: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=400',
          location: { latitude: 28.6139, longitude: 77.2090 },
          severity: 'high',
          description: 'Significant waterlogging near Connaught Place.',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await this.saveReport(mockReport);
        return [mockReport];
      }
      return JSON.parse(reportsJson);
    } catch (error) {
      console.error('Error getting reports:', error);
      return [];
    }
  },

  async updateReportStatus(reportId: string, status: Report['status']): Promise<void> {
    try {
      const reports = await this.getAllReports();
      const updatedReports = reports.map(report => 
        report.id === reportId ? { ...report, status, updated_at: new Date().toISOString() } : report
      );
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  },

  async getReportStats(): Promise<{ total: number; resolved: number }> {
    const reports = await this.getAllReports();
    return {
      total: reports.length,
      resolved: reports.filter(r => r.status === 'resolved').length
    };
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(REPORTS_KEY);
  }
};
