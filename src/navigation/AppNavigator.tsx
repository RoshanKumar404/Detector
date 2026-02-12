import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Screens
import HomeScreen from '../screens/HomeScreen';

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
        {/* Placeholder screens to be implemented */}
        <Stack.Screen 
          name="Camera" 
          component={PlaceholderScreen('Camera')} 
        />
        <Stack.Screen 
          name="ReportDetails" 
          component={PlaceholderScreen('Report Details')} 
        />
        <Stack.Screen 
          name="MapView" 
          component={PlaceholderScreen('Map View')} 
        />
        <Stack.Screen 
          name="MyReports" 
          component={PlaceholderScreen('My Reports')} 
        />
        <Stack.Screen 
          name="Profile" 
          component={PlaceholderScreen('Profile')} 
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
