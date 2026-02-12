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
      return reportsJson ? JSON.parse(reportsJson) : [];
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
