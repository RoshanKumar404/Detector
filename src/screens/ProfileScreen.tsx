import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/colors';
import { storageService } from '../services/storageService';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [reportCount, setReportCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const stats = await storageService.getReportStats();
    setReportCount(stats.total);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your submissions? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive', 
          onPress: async () => {
            await storageService.clearAll();
            setReportCount(0);
            Alert.alert('Success', 'All data has been cleared.');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>RK</Text>
          </View>
          <Text style={styles.userName}>Roshan Kumar</Text>
          <Text style={styles.userEmail}>roshan@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Reports Submitted</Text>
              <Text style={styles.statValue}>{reportCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.gray[300], true: COLORS.primary + '80' }}
                thumbColor={notificationsEnabled ? COLORS.primary : COLORS.gray[400]}
              />
            </View>
            
            <View style={[styles.settingRow, styles.noBorder]}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch value={false} disabled />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingRow, styles.noBorder]}>
              <Text style={styles.settingLabel}>App Version</Text>
              <Text style={styles.versionText}>1.0.0</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
          <Text style={styles.clearButtonText}>Clear All App Data</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Detector App - Final Year Project</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 5,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  versionText: {
    color: COLORS.gray[400],
    fontSize: 14,
  },
  clearButton: {
    margin: 30,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.critical,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.critical,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: COLORS.gray[400],
    fontSize: 12,
    marginBottom: 30,
  }
});

export default ProfileScreen;
