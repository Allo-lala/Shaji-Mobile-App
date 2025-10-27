import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Clipboard,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Document } from '../types';

type ShareProofScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      document: Document;
    };
  };
};

export const ShareProofScreen: React.FC<ShareProofScreenProps> = ({
  route,
}) => {
  const { document } = route.params;
  const [copied, setCopied] = useState(false);

  // Generate verification URL
  const verificationUrl = `https://aqua.verify/${document.id}`;

  const handleCopy = () => {
    Clipboard.setString(verificationUrl);
    ReactNativeHapticFeedback.trigger('impactLight');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (method: string) => {
    try {
      const shareOptions = {
        title: 'Verification Proof',
        message: `Verify "${document.title}" using Aqua Protocol: ${verificationUrl}`,
        url: verificationUrl,
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.log('Share cancelled');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Share Verification Proof</Text>

          {/* QR Code */}
          <Card style={styles.qrCard}>
            <View style={styles.qrContainer}>
              <QRCode
                value={verificationUrl}
                size={280}
                backgroundColor={colors.surface}
                color={colors.textPrimary}
              />
            </View>
          </Card>

          <Text style={styles.instruction}>
            Scan to verify this document
          </Text>

          {/* URL Display */}
          <Card style={styles.urlCard}>
            <Text style={styles.url} numberOfLines={1}>
              {verificationUrl}
            </Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Text style={styles.copyButtonText}>
                {copied ? '✓ Copied' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Share Options */}
          <Text style={styles.shareLabel}>Share via:</Text>
          <View style={styles.shareButtons}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare('email')}
            >
              <Text style={styles.shareIcon}>📧</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare('message')}
            >
              <Text style={styles.shareIcon}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare('airdrop')}
            >
              <Text style={styles.shareIcon}>📱</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => handleShare('clipboard')}
            >
              <Text style={styles.shareIcon}>📋</Text>
            </TouchableOpacity>
          </View>

          {/* Download Button */}
          <Button
            title="Download QR Image"
            onPress={() => {
              // Download QR code logic
              ReactNativeHapticFeedback.trigger('impactMedium');
            }}
            variant="secondary"
          />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Proof expires: Never</Text>
            <Text style={styles.footerBrand}>
              Verification powered by Aqua Protocol
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.headline1,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  qrCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrContainer: {
    padding: spacing.lg,
  },
  instruction: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  urlCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  url: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    fontFamily: 'Courier',
    marginBottom: spacing.md,
  },
  copyButton: {
    backgroundColor: colors.aquaLight,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    ...typography.bodyRegular,
    color: colors.aquaDeep,
    fontWeight: '600',
  },
  shareLabel: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  shareButtons: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  shareButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shareIcon: {
    fontSize: 24,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footerBrand: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
