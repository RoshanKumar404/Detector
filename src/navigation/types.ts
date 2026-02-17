export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Camera: undefined;
  ReportDetails: {
    imageUri: string;
    location?: { latitude: number; longitude: number };
  };
  MapView: undefined;
  MyReports: undefined;
  Profile: undefined;
};
