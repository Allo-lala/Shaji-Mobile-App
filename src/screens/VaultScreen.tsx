import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { DocumentCard } from '../components/document/DocumentCard';
import { ShareModal } from '../components/modals/ShareModal';
import { BottomSheet } from '../components/modals/BottomSheet';
import { Document } from '../types';
import { useDocuments } from '../hooks/useDocuments';

type VaultScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const VaultScreen: React.FC<VaultScreenProps> = ({ navigation }) => {
  const { documents, loading, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs(documents);
    }
  }, [searchQuery, documents]);

  const handleDocumentPress = (doc: Document) => {
    navigation.navigate('VerificationResult', {
      status: doc.status,
      document: doc,
    });
  };

  const handleShare = (doc: Document) => {
    setSelectedDoc(doc);
    setShareModalVisible(true);
  };

  const handleMenu = (doc: Document) => {
    setSelectedDoc(doc);
    setMenuVisible(true);
  };

  const handleDelete = async () => {
    if (selectedDoc) {
      Alert.alert(
        'Delete Document',
        `Are you sure you want to delete "${selectedDoc.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteDocument(selectedDoc.id);
              setMenuVisible(false);
              setSelectedDoc(null);
            },
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.aquaPrimary} />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Documents List */}
      <FlatList
        data={filteredDocs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={() => handleDocumentPress(item)}
            onShare={() => handleShare(item)}
            onMenu={() => handleMenu(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyText}>No documents yet</Text>
            <Text style={styles.emptySubtext}>
              Upload or verify your first paper to get started
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text style={styles.emptyButtonText}>Upload Paper</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Share Modal */}
      {selectedDoc && (
        <ShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          document={selectedDoc}
        />
      )}

      {/* Menu Bottom Sheet */}
      {selectedDoc && (
        <BottomSheet
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          title="Document Options"
          height="50%"
        >
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                handleDocumentPress(selectedDoc);
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuIcon}>ℹ️</Text>
              <Text style={styles.menuLabel}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                handleShare(selectedDoc);
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuIcon}>📤</Text>
              <Text style={styles.menuLabel}>Share Proof</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.menuOption, styles.menuOptionDanger]}
              onPress={handleDelete}
            >
              <Text style={styles.menuIcon}>🗑️</Text>
              <Text style={styles.menuLabelDanger}>Delete Document</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
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
  clearIcon: {
    fontSize: 18,
    color: colors.textTertiary,
    padding: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
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
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    backgroundColor: colors.aquaPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  emptyButtonText: {
    ...typography.bodyLarge,
    color: colors.surface,
    fontWeight: '600',
  },
  menuContent: {
    flex: 1,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  menuOptionDanger: {
    backgroundColor: colors.errorBg,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  menuLabelDanger: {
    ...typography.bodyLarge,
    color: colors.error,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
});