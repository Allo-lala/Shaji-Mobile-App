import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { Badge } from '../common/Badge';
import { Document } from '../../types';

interface DocumentCardProps {
  document: Document;
  onPress: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onMenu?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onShare,
  onDelete,
  onMenu,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Status Badge */}
      <View style={styles.header}>
        <Badge status={document.status} />
        {document.witnesses && document.witnesses > 0 && (
          <View style={styles.witnessContainer}>
            <Text style={styles.witnessText}>👥 {document.witnesses}</Text>
          </View>
        )}
      </View>

      {/* Document Info */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {document.title}
        </Text>
        
        <View style={styles.metadata}>
          <Text style={styles.author}>👤 {document.author}</Text>
          {document.institution && (
            <Text style={styles.institution}>🏛️  {document.institution}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.date}>⏰ {formatDate(document.timestamp)}</Text>
          {document.fileSize && (
            <Text style={styles.size}>📄 {formatFileSize(document.fileSize)}</Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onPress();
          }}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>

        {onShare && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onShare();
            }}
          >
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        )}

        {onMenu && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={(e) => {
              e.stopPropagation();
              onMenu();
            }}
          >
            <Text style={styles.menuIcon}>•••</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  witnessContainer: {
    backgroundColor: colors.aquaLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  witnessText: {
    ...typography.caption,
    color: colors.aquaDeep,
    fontWeight: '600',
  },
  content: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  metadata: {
    marginBottom: spacing.sm,
  },
  author: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  institution: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  size: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  actions: {
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
    backgroundColor: colors.surface,
  },
  actionButtonText: {
    ...typography.bodyRegular,
    color: colors.aquaPrimary,
    fontWeight: '600',
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
});
