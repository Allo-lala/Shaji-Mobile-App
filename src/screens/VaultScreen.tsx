import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Badge } from '../components/common/Badge';
import { Document } from '../types';

type VaultScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

// Mock data - replace with actual storage service
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'AI Ethics Research',
    author: 'John Doe',
    institution: 'MIT',
    timestamp: Date.now() - 86400000 * 2,
    hash: '0x8f3a...c912',
    status: 'verified',
    witnesses: 5,
    filePath: '',
    fileSize: 2400000,
  },
  {
    id: '2',
    title: 'Quantum Computing Paper',
    author: 'Jane Smith',
    institution: 'Stanford',
    timestamp: Date.now() - 86400000 * 4,
    hash: '0x7b2c...d823',
    status: 'verified',
    witnesses: 3,
    filePath: '',
    fileSize: 1800000,
  },
  {
    id: '3',
    title: 'Climate Study Draft',
    author: 'Bob Johnson',
    timestamp: Date.now() - 86400000 * 7,
    hash: '0x6a1b...e734',
    status: 'pending',
    filePath: '',
    fileSize: 3200000,
  },
];

export const VaultScreen: React.FC<VaultScreenProps> = ({ navigation }) => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<Document[]>(mockDocuments);

  useEffect(() => {
    if (searchQuery) {
      const filtered = documents.filter(
        doc =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs(documents);
    }
  }, [searchQuery, documents]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderDocument = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() =>
        navigation.navigate('VerificationResult', {
          status: item.status,
          document: item,
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Badge status={item.status} />
      </View>

      <Text style={styles.documentTitle}>{item.title}</Text>
      <Text style={styles.documentDate}>{formatDate(item.timestamp)}</Text>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>•••</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Documents</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Upload')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Documents List */}
      <FlatList
        data={filteredDocs}
        renderItem={renderDocument}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyText}>No documents yet</Text>
            <Text style={styles.emptySubtext}>
              Upload your first paper to get started
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.headline1,
    color: colors.textPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.aquaPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: colors.surface,
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 40,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyRegular,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  documentCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: spacing.sm,
  },
  documentTitle: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  documentDate: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.aquaPrimary,
  },
  actionButtonText: {
    ...typography.bodyRegular,
    color: colors.aquaPrimary,
    fontWeight: '500',
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  menuIcon: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  emptyText: {
    ...typography.headline2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.bodyRegular,
    color: colors.textTertiary,
  },
});