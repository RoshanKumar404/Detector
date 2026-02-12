# Additional Dependencies Installation Guide

## 📦 Core Dependencies to Install

Run these commands in the Detector project directory:

```bash
# Install all required dependencies at once
npm install @react-native-community/geolocation \
  react-native-permissions \
  react-native-image-resizer \
  react-native-image-crop-picker \
  @react-native-async-storage/async-storage \
  date-fns \
  react-native-vector-icons

# Optional: If you want Redux for state management
npm install @reduxjs/toolkit react-redux
```

## 🔧 Post-Installation Steps

### For Android:

1. **Link native modules (if using React Native < 0.60)**:

   ```bash
   npx react-native link
   ```

2. **Google Maps Setup**:

   - Get API key from Google Cloud Console
   - Add to `android/app/src/main/AndroidManifest.xml`:

   ```xml
   <application>
     <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
   </application>
   ```

3. **Update gradle files** (if needed):
   - Check `android/build.gradle` for Google Services
   - Update `android/app/build.gradle` for permissions

### For iOS:

1. **Install CocoaPods dependencies**:

   ```bash
   cd ios && bundle exec pod install && cd ..
   ```

2. **Google Maps Setup**:

   - Add API key to `ios/Detector/AppDelegate.mm`:

   ```objc
   #import <GoogleMaps/GoogleMaps.h>

   [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
   ```

3. **Update Info.plist** with usage descriptions (see below)

## 📝 Permission Configuration

### Android: `android/app/src/main/AndroidManifest.xml`

Add these permissions before `<application>`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Existing -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Add these -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
                     android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="false" />

    <application
      ...
    >
    </application>
</manifest>
```

### iOS: `ios/Detector/Info.plist`

Add these keys:

```xml
<dict>
  <!-- Camera -->
  <key>NSCameraUsageDescription</key>
  <string>This app needs camera access to capture images of waterlogged roads for reporting</string>

  <!-- Photo Library -->
  <key>NSPhotoLibraryUsageDescription</key>
  <string>This app needs photo library access to select images of waterlogged roads</string>

  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>This app needs permission to save captured images</string>

  <!-- Location -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>This app needs location access to tag the location of waterlogged roads</string>

  <key>NSLocationAlwaysUsageDescription</key>
  <string>This app needs location access to provide accurate location data for waterlogging reports</string>

  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>This app needs location access to tag waterlogging reports with GPS coordinates</string>
</dict>
```

## 🚀 Quick Start Commands

After installing dependencies:

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📱 Testing Installations

Create a test file to verify installations:

**`src/utils/testInstallations.ts`**:

```typescript
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const testPermissions = async () => {
  const result = await check(PERMISSIONS.ANDROID.CAMERA);
  console.log('Camera permission:', result);
};

export const testLocation = () => {
  Geolocation.getCurrentPosition(
    position => console.log('Location:', position),
    error => console.error('Location error:', error),
  );
};

export const testImagePicker = async () => {
  try {
    const image = await ImagePicker.openCamera({
      cropping: false,
      includeExif: true,
    });
    console.log('Image:', image);
  } catch (error) {
    console.error('Image picker error:', error);
  }
};

export const testStorage = async () => {
  try {
    await AsyncStorage.setItem('test', 'value');
    const value = await AsyncStorage.getItem('test');
    console.log('Storage test:', value);
  } catch (error) {
    console.error('Storage error:', error);
  }
};
```

## 🐛 Common Issues & Solutions

### Issue: "Unable to resolve module"

**Solution**:

```bash
npm install
cd ios && bundle exec pod install && cd ..
npx react-native start --reset-cache
```

### Issue: Android build fails

**Solution**:

```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### Issue: iOS build fails

**Solution**:

```bash
cd ios
bundle exec pod deintegrate
bundle exec pod install
cd ..
npm run ios
```

### Issue: Metro bundler cache issues

**Solution**:

```bash
npx react-native start --reset-cache
```

## 📚 Documentation Links

- **React Native Maps**: https://github.com/react-native-maps/react-native-maps
- **Image Picker**: https://github.com/ivpusic/react-native-image-crop-picker
- **Geolocation**: https://github.com/michalchudziak/react-native-geolocation
- **Permissions**: https://github.com/zoontek/react-native-permissions
- **Async Storage**: https://react-native-async-storage.github.io/async-storage/

---

**Status**: Ready to install
**Next Step**: Run the npm install command above
