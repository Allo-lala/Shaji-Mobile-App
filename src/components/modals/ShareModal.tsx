import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { colors, typography, spacing } from '../../theme';
import { BottomSheet } from './BottomSheet';
import { Button } from '../common/Button';
import { Document } from '../../types';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  document: Document;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  document,
}) => {
  const [copied, setCopied] = useState(false);

  const verificationUrl = `https://aqua.verify/${document.id}`;

  const handleCopy = () => {
    Clipboard.setString(verificationUrl);
    ReactNativeHapticFeedback.trigger('impactLight');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (method: string) => {
    try {
      ReactNativeHapticFeedback.trigger('impactMedium');
      
      const shareOptions = {
        title: 'Verification Proof - Aqua Protocol',
        message: `Verify "${document.title}" by ${document.author} using Aqua Protocol.\n\nVerification URL: ${verificationUrl}`,
        url: verificationUrl,
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.log('Share cancelled or failed');
    }
  };

  const shareViaEmail = async () => {
    try {
      const shareOptions = {
        title: 'Verification Proof',
        message: `Please verify this document using Aqua Protocol: ${verificationUrl}`,
        email: '',
        subject: `Verification Request: ${document.title}`,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Email share cancelled');
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Share Verification Proof"
      height="80%"
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Code */}
        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            <QRCode
              value={verificationUrl}
              size={240}
              backgroundColor={colors.surface}
              color={colors.textPrimary}
            />
          </View>
          <Text style={styles.qrLabel}>Scan to verify this document</Text>
        </View>

        {/* URL Section */}
        <View style={styles.urlSection}>
          <Text style={styles.sectionTitle}>Verification Link</Text>
          <View style={styles.urlContainer}>
            <Text style={styles.url} numberOfLines={2}>
              {verificationUrl}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.copyButton,
              copied && styles.copyButtonSuccess,
            ]}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.copyButtonText,
                copied && styles.copyButtonTextSuccess,
              ]}
            >
              {copied ? '✓ Copied!' : '📋 Copy Link'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Share Options */}
        <View style={styles.shareSection}>
          <Text style={styles.sectionTitle}>Share via</Text>
          <View style={styles.shareGrid}>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={shareViaEmail}
            >
              <View style={styles.shareIconContainer}>
                <Text style={styles.shareIcon}>📧</Text>
              </View>
              <Text style={styles.shareLabel}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleShare('message')}
            >
              <View style={styles.shareIconContainer}>
                <Text style={styles.shareIcon}>💬</Text>
              </View>
              <Text style={styles.shareLabel}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleShare('whatsapp')}
            >
              <View style={styles.shareIconContainer}>
                <Text style={styles.shareIcon}>📱</Text>
              </View>
              <Text style={styles.shareLabel}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleShare('more')}
            >
              <View style={styles.shareIconContainer}>
                <Text style={styles.shareIcon}>⋯</Text>
              </View>
              <Text style={styles.shareLabel}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Document Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Document Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Title:</Text>
              <Text style={styles.infoValue} numberOfLines={2}>
                {document.title}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Author:</Text>
              <Text style={styles.infoValue}>{document.author}</Text>
            </View>
            {document.institution && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Institution:</Text>
                  <Text style={styles.infoValue}>{document.institution}</Text>
                </View>
              </>
            )}
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      document.status === 'verified'
                        ? colors.success
                        : colors.warning,
                  },
                ]}
              >
                {document.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Download QR Code"
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactMedium');
              // Implement QR download logic
            }}
            variant="secondary"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This verification proof is permanently stored on the Aqua Protocol
            network and never expires.
          </Text>
          <Text style={styles.footerBrand}>
            🌊 Powered by Aqua Protocol
          </Text>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  qrContainer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: spacing.md,
  },
  qrLabel: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  urlSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  urlContainer: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  url: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    fontFamily: 'Courier',
  },
  copyButton: {
    backgroundColor: colors.aquaPrimary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  copyButtonSuccess: {
    backgroundColor: colors.success,
  },
  copyButtonText: {
    ...typography.bodyLarge,
    color: colors.surface,
    fontWeight: '600',
  },
  copyButtonTextSuccess: {
    color: colors.surface,
  },
  shareSection: {
    marginBottom: spacing.xxl,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  shareOption: {
    width: '22%',
    alignItems: 'center',
  },
  shareIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  shareIcon: {
    fontSize: 24,
  },
  shareLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: spacing.xl,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.lg,
  },
  infoRow: {
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  actions: {
    marginBottom: spacing.xl,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  footerBrand: {
    ...typography.caption,
    color: colors.aquaPrimary,
    fontWeight: '600',
  },
});