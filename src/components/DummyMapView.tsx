import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface Location {
  latitude: number;
  longitude: number;
}

interface Report {
  id: string;
  location: Location;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface DummyMapViewProps {
  reports: Report[];
  showHeatmap: boolean;
  onMarkerPress?: (report: Report) => void;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

// Simulated coordinate mapping for the dummy map
// This approximates a local area around the provided region
const getScreenPosition = (location: Location, region: DummyMapViewProps['region']) => {
  const latDiff = (location.latitude - region.latitude) / region.latitudeDelta;
  const lonDiff = (location.longitude - region.longitude) / region.longitudeDelta;
  
  // Center is (width/2, height/2)
  // We flip latitude because Y-axis in screen coordinates goes down
  const x = (width / 2) + (lonDiff * width);
  const y = (height / 2) - (latDiff * height);
  
  return { x, y };
};

const DummyMapView: React.FC<DummyMapViewProps> = ({ reports, showHeatmap, onMarkerPress, region }) => {
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
    <View style={styles.container}>
      {/* High-quality map placeholder image */}
      <Image 
        source={{ uri: 'https://www.mapsofindia.com/maps/jharkhand/ranchi.jpg' }} 
        style={styles.mapBackground}
        resizeMode="cover"
      />
      
      {/* Overlay darkening for better visibility of data */}
      <View style={styles.overlay} />

      {/* Markers */}
      {!showHeatmap && reports.map(report => {
        const { x, y } = getScreenPosition(report.location, region);
        
        // Skip rendering if significantly off-screen
        if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return null;

        return (
          <TouchableOpacity
            key={report.id}
            style={[styles.marker, { left: x, top: y, backgroundColor: getSeverityColor(report.severity) }]}
            onPress={() => onMarkerPress?.(report)}
          >
            <View style={styles.markerInner} />
          </TouchableOpacity>
        );
      })}

      {/* Simulated Heatmap */}
      {showHeatmap && reports.length > 0 && (
        <View style={StyleSheet.absoluteFill}>
          {reports.map(report => {
            const { x, y } = getScreenPosition(report.location, region);
            if (x < -100 || x > width + 100 || y < -100 || y > height + 100) return null;
            
            const size = report.severity === 'critical' ? 120 : report.severity === 'high' ? 90 : 60;
            const opacity = report.severity === 'critical' ? 0.6 : 0.4;
            
            return (
              <View
                key={`heat-${report.id}`}
                style={[
                  styles.heatPoint,
                  {
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    backgroundColor: getSeverityColor(report.severity),
                    opacity: opacity,
                    borderRadius: size / 2,
                  }
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  mapBackground: {
    width: width,
    height: height,
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  marker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  heatPoint: {
    position: 'absolute',
    // Simulated radial gradient effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  }
});

export default DummyMapView;
