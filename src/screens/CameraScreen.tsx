import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../constants/colors';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

type CameraScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Camera'>;
};

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCapture = async () => {
    if (Platform.OS === 'android') {
      const permission = await request(PERMISSIONS.ANDROID.CAMERA);
      if (permission !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        return;
      }
    }

    launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      saveToPhotos: true,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Camera error');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
        }
      }
    });
  };

  const handleSelectFromGallery = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Gallery error');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setImageUri(uri);
        }
      }
    });
  };

  const handleContinue = () => {
    if (imageUri) {
      navigation.navigate('ReportDetails', { imageUri });
    } else {
      Alert.alert('No Image', 'Please capture or select an image first.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Capture Waterlogging</Text>
        <Text style={styles.subtitle}>Take a clear photo of the affected area.</Text>

        <View style={styles.previewContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={handleCapture}>
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSelectFromGallery}>
            <Text style={styles.secondaryButtonText}>Select from Gallery</Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    marginBottom: 20,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.gray[200],
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.gray[400],
    fontSize: 16,
  },
  buttonGroup: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  continueButtonText: {
    color: COLORS.onSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
