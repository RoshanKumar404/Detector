import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import MyReportsScreen from '../screens/MyReportsScreen';
import MapViewScreen from '../screens/MapViewScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Dashboard' }} 
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Capture Image' }} 
        />
        <Stack.Screen 
          name="ReportDetails" 
          component={ReportDetailsScreen} 
          options={{ title: 'Report Details' }} 
        />
        <Stack.Screen 
          name="MyReports" 
          component={MyReportsScreen} 
          options={{ title: 'My Submissions' }} 
        />
        
        {/* Placeholder screens to be implemented */}
        <Stack.Screen 
          name="MapView" 
          component={MapViewScreen} 
          options={{ title: 'Waterlogging Map' }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'My Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Helper to create placeholder screens during initial setup
function PlaceholderScreen(name: string) {
  const { View, Text } = require('react-native');
  return () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{name} Screen Coming Soon!</Text>
    </View>
  );
}

export default AppNavigator;
