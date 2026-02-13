import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/colors';
import { storageService } from '../services/storageService';
import { Report } from '../types';
import { format } from 'date-fns';

type MyReportsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MyReports'>;
};

const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ navigation }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const data = await storageService.getAllReports();
    setReports(data);
    setLoading(false);
  };


  const renderReportItem = ({ item }: { item: Report }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'resolved' ? COLORS.low : COLORS.medium }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.cardFooter}>
        <View 
          style={[styles.severityBadge, { borderColor: COLORS[item.severity] }]}
        >
          <Text style={[styles.severityText, { color: COLORS[item.severity] }]}>
            {item.severity.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Submissions</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't submitted any reports yet.</Text>
          </View>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={renderReportItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: 10,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  resolveButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  resolveButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[500],
  }
});

export default MyReportsScreen;
