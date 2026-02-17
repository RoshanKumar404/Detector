import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Dimensions } from 'react-native';
import DummyMapView from '../components/DummyMapView';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useFocusEffect } from '@react-navigation/native';
import { storageService } from '../services/storageService';
import { Report } from '../types';
import { COLORS } from '../constants/colors';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { Region } from 'react-native-maps';
// import { GOOGLE_MAPS_API_KEY } from '@env'; 
const GOOGLE_MAPS_API_KEY: string = ''; 

const { width, height } = Dimensions.get('window');

const MapViewScreen = () => {
  const [reports, setReports] = useState<Report[]>([]);
  
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 28.6139, // Default to New Delhi
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const loadReports = async () => {
    console.log('Fetching reports...');
    try {
      // Try to fetch from API first
      const apiReports = await apiService.getIssues();
      console.log('API Reports fetched:', apiReports.length);
      
      // Combine with local reports for complete view or just use API
      // For now, let's use API if available, else fallback
      if (apiReports && apiReports.length > 0) {
          setReports(apiReports);
          centerMap(apiReports);
      } else {
          const localReports = await storageService.getAllReports();
          setReports(localReports);
          centerMap(localReports);
      }
    } catch (err) {
      console.error('Failed to load reports from API:', err);
      const localReports = await storageService.getAllReports();
      setReports(localReports);
      centerMap(localReports);
    }
  };

  const centerMap = (data: Report[]) => {
    if (data.length > 0) {
        const latest = data[0];
        setMapRegion(prev => ({
          ...prev,
          latitude: latest.location.latitude,
          longitude: latest.location.longitude,
        }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const heatmapPoints = useMemo(() => {
    return reports.map(report => ({
      latitude: report.location.latitude,
      longitude: report.location.longitude,
      weight: report.severity === 'critical' ? 4 : report.severity === 'high' ? 3 : report.severity === 'medium' ? 2 : 1,
    }));
  }, [reports]);

  const getSeverityColor = (severity: Report['severity']) => {
    switch (severity) {
      case 'low': return COLORS.low;
      case 'medium': return COLORS.medium;
      case 'high': return COLORS.high;
      case 'critical': return COLORS.critical;
      default: return COLORS.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search Place..."
          onPress={(data, details = null) => {
            if (details) {
              setMapRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
          }}
          fetchDetails={true}
          styles={{
            container: { flex: 0 },
            textInput: styles.searchInput,
          }}
        />
      </View>

      <DummyMapView
        reports={reports}
        showHeatmap={showHeatmap}
        region={mapRegion}
      />

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.toggleButton, showHeatmap && styles.activeToggle]}
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <Text style={[styles.toggleText, showHeatmap && styles.activeToggleText]}>
            {showHeatmap ? 'Show Markers' : 'Show Heatmap'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: height,
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    width: '90%',
    alignSelf: 'center',
    zIndex: 10,
    elevation: 5,
  },
  searchInput: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    zIndex: 10,
  },
  toggleButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeToggleText: {
    color: '#fff',
  },
});

export default MapViewScreen;
