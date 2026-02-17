import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/colors';
import { storageService } from '../services/storageService';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
      loadStats();
    }, [navigation])
  );

  const checkAuth = async () => {
    const authed = await authService.isAuthenticated();
    setIsLoggedIn(authed);
    
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate(authed ? 'Profile' : 'Login')} 
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {authed ? 'Profile' : 'Login'}
          </Text>
        </TouchableOpacity>
      ),
    });
  };

  const loadStats = async () => {
    try {
      const authed = await authService.isAuthenticated();
      if (!authed) {
        // Fallback to local storage or dummy if not logged in
        const data = await storageService.getReportStats();
        setStats(data);
        return;
      }

      const user = await authService.getUser();
      if (user) {
        const issues = await apiService.getIssues(user.id);
        setStats({
          total: issues.length,
          resolved: issues.filter((i: any) => i.status === 'resolved').length
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Water Logging Detector</Text>
          <Text style={styles.subtitle}>Help your community by reporting waterlogged roads.</Text>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => navigation.navigate('MyReports')}
            >
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>My Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: COLORS.low + '20' }]}
              onPress={() => navigation.navigate('MyReports')}
            >
              <Text style={[styles.statNumber, { color: COLORS.low }]}>{stats.resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.buttonText}>Report Waterlogging</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { marginTop: 15 }]}
            onPress={() => navigation.navigate('MapView')}
          >
            <Text style={styles.secondaryButtonText}>View Heatmap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
    width: '45%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 5,
  },
  mainButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
