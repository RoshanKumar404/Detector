# Water Logging Detection App - Implementation Plan

## 🎯 Project Overview

A civic tech mobile application for citizens to report waterlogged roads with AI-powered detection and geospatial clustering for municipal departments.

## 📱 Mobile App Features

### 1. Core Features

- **Image Capture & Upload**: Camera integration with gallery fallback
- **GPS Extraction**: Automatic location detection from images and device
- **Waterlogging Detection**: AI-based severity classification
- **Interactive Maps**: Heatmap visualization with clustering
- **Report Management**: Track submission status and history
- **Notifications**: Real-time updates on report status

### 2. User Flows

#### Submit Report Flow:

1. Open app → Tap "Report Waterlogging"
2. Take photo or select from gallery
3. GPS auto-extracted, can manually adjust pin on map
4. Add optional description
5. Submit → AI classification runs
6. Receive confirmation & tracking ID

#### View Reports Flow:

1. Open map view
2. See heatmap of waterlogging severity
3. Tap cluster/marker for details
4. Filter by severity, date, status

## 🛠️ Technology Stack

### Mobile App (React Native)

- **Framework**: React Native 0.84.0
- **Language**: TypeScript
- **State Management**: React Context / Redux Toolkit
- **Navigation**: React Navigation v7
- **Maps**: react-native-maps (Google Maps / OSM)
- **Image Handling**: react-native-image-picker
- **Location**: @react-native-community/geolocation
- **HTTP Client**: axios
- **Image Compression**: react-native-image-resizer
- **Storage**: @react-native-async-storage/async-storage

### Backend (Suggested)

- **Runtime**: Node.js with Express OR Python with FastAPI
- **AI/ML**: TensorFlow.js / PyTorch for image classification
- **Database**: PostgreSQL + PostGIS (for geospatial queries)
- **File Storage**: AWS S3 / Google Cloud Storage
- **Clustering**: DBSCAN or K-Means for location clustering

### Municipal Dashboard (Suggested)

- **Framework**: React.js / Next.js
- **Maps**: Leaflet.js or Google Maps JS API
- **Heatmap**: leaflet.heat plugin
- **Charts**: Chart.js / Recharts

## 📂 Recommended Project Structure

```
Detector/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── ReportDetailsScreen.tsx
│   │   ├── MapViewScreen.tsx
│   │   ├── MyReportsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loader.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── MapComponent.tsx
│   │   ├── ReportCard.tsx
│   │   └── SeverityBadge.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── imageService.ts
│   │   ├── locationService.ts
│   │   └── storageService.ts
│   ├── utils/
│   │   ├── permissions.ts
│   │   ├── imageHelpers.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── Report.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── config.ts
│   │   └── strings.ts
│   └── hooks/
│       ├── useCamera.ts
│       ├── useLocation.ts
│       └── useReports.ts
├── assets/
│   ├── images/
│   └── icons/
├── App.tsx
└── index.js
```

## 🔄 API Endpoints (Backend)

### Reports API

```
POST   /api/reports              - Submit new report
GET    /api/reports              - Get all reports (with filters)
GET    /api/reports/:id          - Get specific report
PUT    /api/reports/:id/status   - Update report status
DELETE /api/reports/:id          - Delete report
```

### Classification API

```
POST   /api/classify             - Classify waterlogging image
```

### User API

```
POST   /api/auth/register        - Register user
POST   /api/auth/login           - Login user
GET    /api/users/me/reports     - Get user's reports
```

### Analytics API

```
GET    /api/analytics/heatmap    - Get heatmap data
GET    /api/analytics/clusters   - Get clustered locations
GET    /api/analytics/stats      - Get overall statistics
```

## 🗄️ Database Schema

### Reports Table

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  image_url TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location GEOGRAPHY(POINT, 4326), -- PostGIS
  severity VARCHAR(20), -- low, medium, high, critical
  confidence_score DECIMAL(3, 2),
  description TEXT,
  status VARCHAR(20), -- pending, verified, resolved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_location ON reports USING GIST(location);
CREATE INDEX idx_status ON reports(status);
CREATE INDEX idx_created_at ON reports(created_at);
```

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 UI/UX Considerations

### Color Scheme (Severity-based)

- **Low**: 🟢 Green (#4CAF50)
- **Medium**: 🟡 Yellow (#FFC107)
- **High**: 🟠 Orange (#FF9800)
- **Critical**: 🔴 Red (#F44336)

### Key Screens Design

1. **Home**: Stats cards, quick report button, recent activity
2. **Camera**: Full-screen camera with guidelines overlay
3. **Map**: Clustered markers, heatmap toggle, filter controls
4. **Report Details**: Image preview, location map, severity badge

## 📊 AI Classification Model

### Approach Options:

1. **Transfer Learning**: Use pre-trained models (MobileNet, EfficientNet)
2. **Custom CNN**: Train on waterlogging dataset
3. **Classification Classes**:
   - No Waterlogging
   - Low (ankle-deep, <6 inches)
   - Medium (knee-deep, 6-18 inches)
   - High (waist-deep, >18 inches)

### Model Deployment:

- **Option 1**: Backend inference (send image to server)
- **Option 2**: On-device with TensorFlow Lite (faster, offline)

## 🔐 Permissions Required

### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture waterlogged road images</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select images</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need location access to tag waterlogging reports</string>
```

## 🚀 Implementation Phases

### Phase 1: Setup & Core Features (Week 1-2)

- [x] Project setup with React Native
- [ ] Install additional dependencies
- [ ] Set up navigation structure
- [ ] Create basic UI components
- [ ] Implement image capture/selection
- [ ] GPS extraction from images

### Phase 2: Backend Integration (Week 3-4)

- [ ] Set up backend server
- [ ] Implement report submission API
- [ ] Storage integration (S3/GCS)
- [ ] Database setup
- [ ] Basic AI classification

### Phase 3: Maps & Visualization (Week 5-6)

- [ ] Integrate maps display
- [ ] Implement clustering algorithm
- [ ] Heatmap visualization
- [ ] Filter and search functionality

### Phase 4: Advanced Features (Week 7-8)

- [ ] User authentication
- [ ] Report status tracking
- [ ] Push notifications
- [ ] Municipal dashboard basics
- [ ] Analytics & insights

### Phase 5: Testing & Deployment (Week 9-10)

- [ ] Unit testing
- [ ] Integration testing
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Play Store / App Store deployment

## 📝 Next Immediate Steps

1. **Install missing dependencies**
2. **Create project folder structure**
3. **Set up navigation**
4. **Build Camera/Upload screen**
5. **Implement GPS extraction**
6. **Create mock API for testing**

## 🔗 Resources & References

- React Native Docs: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- React Native Maps: https://github.com/react-native-maps/react-native-maps
- TensorFlow Lite: https://www.tensorflow.org/lite
- PostGIS Documentation: https://postgis.net/docs/

---

**Created**: 2026-02-12
**Status**: Planning Phase
**Priority**: High
