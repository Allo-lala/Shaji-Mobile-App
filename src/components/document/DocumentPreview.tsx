import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { colors, typography, spacing } from '../../theme';
import { Document } from '../../types';

interface DocumentPreviewProps {
  document: Document;
  visible: boolean;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  visible,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const isPDF = document.filePath.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(document.filePath);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {document.title}
            </Text>
            {isPDF && totalPages > 0 && (
              <Text style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </Text>
            )}
          </View>
        </View>

        {/* Preview Content */}
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.aquaPrimary} />
              <Text style={styles.loadingText}>Loading document...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setError(null);
                  setLoading(true);
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!error && isPDF && (
            <Pdf
              source={{ uri: document.filePath }}
              style={styles.pdf}
              onLoadComplete={(numberOfPages) => {
                setTotalPages(numberOfPages);
                setLoading(false);
              }}
              onPageChanged={(page) => {
                setCurrentPage(page);
              }}
              onError={(error) => {
                setError('Failed to load PDF');
                setLoading(false);
                console.error(error);
              }}
              trustAllCerts={false}
              enablePaging={true}
            />
          )}

          {!error && isImage && (
            <ScrollView
              style={styles.imageScrollView}
              contentContainerStyle={styles.imageContainer}
              minimumZoomScale={1}
              maximumZoomScale={3}
            >
              <Image
                source={{ uri: document.filePath }}
                style={styles.image}
                resizeMode="contain"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError('Failed to load image');
                  setLoading(false);
                }}
              />
            </ScrollView>
          )}

          {!error && !isPDF && !isImage && (
            <View style={styles.unsupportedContainer}>
              <Text style={styles.unsupportedIcon}>📄</Text>
              <Text style={styles.unsupportedText}>
                Preview not available for this file type
              </Text>
              <Text style={styles.unsupportedSubtext}>
                {document.filePath.split('.').pop()?.toUpperCase()} files cannot be previewed
              </Text>
            </View>
          )}
        </View>

        {/* Document Info Footer */}
        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Author:</Text>
            <Text style={styles.infoValue}>{document.author}</Text>
          </View>
          {document.institution && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Institution:</Text>
              <Text style={styles.infoValue}>{document.institution}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text
              style={[
                styles.infoValue,
                { color: document.status === 'verified' ? colors.success : colors.warning },
              ]}
            >
              {document.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  pageInfo: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  retryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.aquaPrimary,
    borderRadius: 12,
  },
  retryButtonText: {
    ...typography.bodyLarge,
    color: colors.surface,
    fontWeight: '600',
  },
  pdf: {
    flex: 1,
    width,
    height,
  },
  imageScrollView: {
    flex: 1,
  },
  imageContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - spacing.xxl * 2,
    height: height - 200,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  unsupportedIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  unsupportedText: {
    ...typography.headline2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  unsupportedSubtext: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyRegular,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});