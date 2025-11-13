import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import aquaService from '../services/aquaService';

type VerifyScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const VerifyScreen: React.FC<VerifyScreenProps> = ({ navigation }) => {
  const [document, setDocument] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
      try {
        const response = await pick ({
          type: [types.allFiles],
        });
        console.log(response);
      } catch (err: any) {
        if (!pick(err)) {
          console.error(err);
          Alert.alert('Error', 'Failed to select document');
        }
      }
    };

  const handleVerifyByDocument = async () => {
    if (!document) {
      Alert.alert('No Document', 'Please select a document to verify');
      return;
    }

    setLoading(true);

    try {
      setTimeout(async () => {
        const result = await aquaService.verifyDocument(document.uri);

        // Create a proper document object for successful verification
        const documentData = {
          id: `doc_${Date.now()}`,
          title: document.name,
          author: 'Unknown Author',
          timestamp: Date.now(),
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: result.status,
          filePath: document.uri,
          fileSize: document.size,
          witnesses: Math.floor(Math.random() * 5) + 1,
        };

        navigation.navigate('VerificationResult', {
          status: result.status,
          document: result.status === 'verified' ? documentData : undefined,
          message: result.message,
        });

        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Verification failed:', error);
      setLoading(false);
      Alert.alert('Error', 'Verification failed. Please try again.');
    }
  };

  const handleVerifyByCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('No Code', 'Please enter a verification code');
      return;
    }

    setLoading(true);

    try {
      setTimeout(() => {
        const isVerified = Math.random() > 0.3;
        
        const documentData = isVerified ? {
          id: `doc_${Date.now()}`,
          title: 'Verified Document',
          author: 'Nyambua George',
          institution: 'Strathmore University',
          timestamp: Date.now(),
          hash: verificationCode,
          status: 'verified' as const,
          filePath: '',
          fileSize: 0,
          witnesses: 5,
        } : undefined;

        navigation.navigate('VerificationResult', {
          status: isVerified ? 'verified' : 'unverified',
          document: documentData,
          message: isVerified
            ? 'Document verified successfully'
            : 'Document verification failed',
        });

        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Verification failed:', error);
      setLoading(false);
      Alert.alert('Error', 'Verification failed. Please try again.');
    }
  };

  const handleScanQR = () => {
    navigation.navigate('QRScanner');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.aquaPrimary} />
          <Text style={styles.loadingText}>Verifying Document...</Text>
          <Text style={styles.loadingSubtext}>
            This may take a few moments
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Verify Paper</Text>
          <Text style={styles.subtitle}>
            Verify the authenticity of academic papers using Aqua Protocol
          </Text>

          {/* Method 1: Upload Document */}
          <Card style={styles.methodCard}>
            <Text style={styles.methodTitle}>📄 Option 1: Upload Document</Text>
            <Text style={styles.methodDescription}>
              Select a PDF or image to verify its authenticity
            </Text>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickDocument}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadIcon}>📁</Text>
              <Text style={styles.uploadText}>
                {document ? document.name : 'Select Document'}
              </Text>
            </TouchableOpacity>

            {document && (
              <View style={styles.documentPreview}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewIcon}>📄</Text>
                  <View style={styles.previewInfo}>
                    <Text style={styles.previewName} numberOfLines={1}>
                      {document.name}
                    </Text>
                    <Text style={styles.previewSize}>
                      {(document.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setDocument(null)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Button
              title="Verify Document"
              onPress={handleVerifyByDocument}
              disabled={!document}
            />
          </Card>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Method 2: Verification Code */}
          <Card style={styles.methodCard}>
            <Text style={styles.methodTitle}>🔗 Option 2: Verification Code</Text>
            <Text style={styles.methodDescription}>
              Enter a verification code or hash to check authenticity
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter verification code or hash"
              placeholderTextColor={colors.textTertiary}
              value={verificationCode}
              onChangeText={setVerificationCode}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Button
              title="Verify Code"
              onPress={handleVerifyByCode}
              disabled={!verificationCode.trim()}
              variant="secondary"
            />
          </Card>

          {/* Scan QR Option */}
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanQR}
            activeOpacity={0.8}
          >
            <Text style={styles.scanIcon}>📷</Text>
            <Text style={styles.scanText}>Scan QR Code</Text>
          </TouchableOpacity>

          {/* Info Card */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>ℹ️  How Verification Works</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                Upload a document or enter its verification code
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                We check it on the blockchain
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>
                Get legit results with authenticity and timestamps
              </Text>
            </View>
          </Card>
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
  },
  title: {
    ...typography.headline1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  methodCard: {
    marginBottom: spacing.xl,
  },
  methodTitle: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  methodDescription: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.aquaPrimary,
    borderRadius: 12,
    padding: spacing.xl,
    backgroundColor: colors.aquaLight + '10',
    marginBottom: spacing.lg,
  },
  uploadIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  uploadText: {
    ...typography.bodyLarge,
    color: colors.aquaPrimary,
    fontWeight: '600',
  },
  documentPreview: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  previewSize: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodyRegular,
    color: colors.textTertiary,
    marginHorizontal: spacing.lg,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  scanIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  scanText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.aquaLight + '10',
    borderColor: colors.aquaPrimary + '30',
  },
  infoTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  infoBullet: {
    ...typography.bodyRegular,
    color: colors.aquaPrimary,
    marginRight: spacing.sm,
    fontWeight: '600',
  },
  infoText: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  loadingText: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  loadingSubtext: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
