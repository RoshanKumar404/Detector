import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/colors';
import { Severity, Report } from '../types';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { storageService } from '../services/storageService';

type ReportDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ReportDetails'>;

const ReportDetailsScreen: React.FC<ReportDetailsScreenProps> = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    fetchRealLocation();
  }, []);

  const fetchRealLocation = async () => {
    setIsFetchingLocation(true);
    try {
      let permissionResult;
      if (Platform.OS === 'android') {
        permissionResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      } else {
        permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }

      if (permissionResult === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setIsFetchingLocation(false);
          },
          (error) => {
            console.error('Location Error:', error);
            Alert.alert('Location Error', 'Unable to fetch real location. Using placeholder.');
            setLocation({ latitude: 28.6139, longitude: 77.2090 });
            setIsFetchingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to tag the report.');
        setLocation({ latitude: 28.6139, longitude: 77.2090 });
        setIsFetchingLocation(false);
      }
    } catch (error) {
      console.error('Permission Error:', error);
      setIsFetchingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Required', 'Please provide a short description.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newReport: Report = {
        id: Date.now().toString(),
        userId: 'current-user', // Mock user ID
        imageUrl: imageUri,
        location: location,
        severity: severity,
        description: description,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await storageService.saveReport(newReport);

      setIsSubmitting(false);
      Alert.alert(
        'Success',
        'Report submitted successfully! Thank you for helping the community.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to save report. Please try again.');
    }
  };

  const severityOptions: { key: Severity; label: string; color: string }[] = [
    { key: 'low', label: 'Low', color: COLORS.low },
    { key: 'medium', label: 'Medium', color: COLORS.medium },
    { key: 'high', label: 'High', color: COLORS.high },
    { key: 'critical', label: 'Critical', color: COLORS.critical },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Report Details</Text>

        <Image source={{ uri: imageUri }} style={styles.imagePreview} />

        <View style={styles.section}>
          <Text style={styles.label}>Location Detected</Text>
          <View style={styles.locationBox}>
            {isFetchingLocation ? (
              <View style={styles.fetchingRow}>
                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={styles.locationText}>Fetching real location...</Text>
              </View>
            ) : (
              <Text style={styles.locationText}>
                Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
              </Text>
            )}
          </View>
          {!isFetchingLocation && (
            <TouchableOpacity onPress={fetchRealLocation} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry Location</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Severity Level</Text>
          <View style={styles.severityContainer}>
            {severityOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.severityButton,
                  { borderColor: option.color },
                  severity === option.key && { backgroundColor: option.color },
                ]}
                onPress={() => setSeverity(option.key)}
              >
                <Text
                  style={[
                    styles.severityText,
                    { color: option.color },
                    severity === option.key && { color: '#fff' },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="E.g. Road blocked near Central Mall..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (isSubmitting || isFetchingLocation) && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={isSubmitting || isFetchingLocation}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[500],
    marginBottom: 10,
  },
  locationBox: {
    backgroundColor: COLORS.gray[200],
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fetchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  retryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  severityButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
  },
  severityText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: COLORS.gray[400],
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportDetailsScreen;
