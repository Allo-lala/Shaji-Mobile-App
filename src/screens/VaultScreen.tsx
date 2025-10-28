import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DocumentCard } from '../components/document/DocumentCard';
import { DocumentPreview } from '../components/document/DocumentPreview';
import { ShareModal } from '../components/modals/ShareModal';
import { BottomSheet } from '../components/modals/BottomSheet';
import { colors, spacing, typography } from '../theme';
import { Document } from '../types';
import { useDocuments } from '../hooks/useDocuments';
import { RootStackParamList } from '../types/navigation';

//  Navigation type
type EnhancedVaultScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Vault'
>;

type EnhancedVaultScreenProps = {
  navigation: EnhancedVaultScreenNavigationProp;
};

export const EnhancedVaultScreen: React.FC<EnhancedVaultScreenProps> = ({
  navigation,
}) => {
  const { documents, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  //  Search Filtering
  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  Handlers
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

  const handlePreview = (doc: Document) => {
    setSelectedDoc(doc);
    setPreviewVisible(true);
  };

  const handleMenu = (doc: Document) => {
    setSelectedDoc(doc);
    setMenuVisible(true);
  };

  const handleDelete = async () => {
    if (selectedDoc) {
      await deleteDocument(selectedDoc.id);
      setMenuVisible(false);
      setSelectedDoc(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
      />

      {/* Document Preview Modal */}
      {selectedDoc && (
        <DocumentPreview
          document={selectedDoc}
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
        />
      )}

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
                handlePreview(selectedDoc);
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuIcon}>👁️</Text>
              <Text style={styles.menuLabel}>Preview Document</Text>
            </TouchableOpacity>

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

            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                // TODO: Implement re-verification logic
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuIcon}>🔄</Text>
              <Text style={styles.menuLabel}>Re-verify</Text>
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

// Ensure this file exports VaultScreen
export const VaultScreen = () => {
  return (
    <div>
      {/* Add your VaultScreen implementation here */}
      Vault Screen Content
    </div>
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
    color: colors.error,
    ...typography.bodyLarge,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
});
