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
} from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
import { pick, types } from '@react-native-documents/picker';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import aquaService from '../services/aquaService';

type UploadScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const UploadScreen: React.FC<UploadScreenProps> = ({ navigation }) => {
  const [document, setDocument] = useState<any>(null);
  const [author, setAuthor] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  const pickDocument = async () => {
    try {
      const response = await pick ({
        type: [types.allFiles],
      });
      console.log(response);
    } catch (err: any) {
      if (!pick(err)) {
        console.error(err);
      }
    }
  };

  const handleNotarize = async () => {
    if (!document || !author) return;

    setLoading(true);
    setProgress(['Generating cryptographic hash']);

    try {
      // Simulate progress
      setTimeout(() => {
        setProgress(prev => [...prev, 'Creating timestamp proof']);
      }, 1000);

      setTimeout(() => {
        setProgress(prev => [...prev, 'Requesting witnesses']);
      }, 2000);

      // Call Aqua SDK
      const proof = await aquaService.notarizeDocument(document.uri, {
        author,
        institution,
        title: document.name,
      });

      setTimeout(() => {
        navigation.navigate('VerificationResult', {
          status: 'verified',
          document: {
            id: proof.notarizationId,
            title: document.name,
            author,
            institution,
            timestamp: proof.timestamp,
            hash: proof.merkleRoot,
            status: 'verified',
            filePath: document.uri,
            fileSize: document.size,
            aquaProof: proof,
          },
        });
      }, 3000);
    } catch (error) {
      console.error('Notarization failed:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.rippleContainer}>
            <ActivityIndicator size="large" color={colors.aquaPrimary} />
          </View>
          <Text style={styles.loadingTitle}>Notarizing Document</Text>
          <View style={styles.progressList}>
            {progress.map((step, index) => (
              <View key={index} style={styles.progressItem}>
                <Text style={styles.progressIcon}>
                  {index === progress.length - 1 ? '⟳' : '✓'}
                </Text>
                <Text style={styles.progressText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Upload Paper</Text>

          {/* Upload Zone */}
          <TouchableOpacity
            style={styles.uploadZone}
            onPress={pickDocument}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadIcon}>📁</Text>
            <Text style={styles.uploadText}>Select Document</Text>
            <Text style={styles.uploadSubtext}>or</Text>
            <Text style={styles.uploadText}>📸 Scan Paper</Text>
          </TouchableOpacity>

          {/* Document Preview */}
          {document && (
            <Card style={styles.previewCard}>
              <View style={styles.preview}>
                <Text style={styles.previewIcon}>📄</Text>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>{document.name}</Text>
                  <Text style={styles.previewMeta}>
                    {(document.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Author Details */}
          <Text style={styles.sectionTitle}>Author Details</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.textTertiary}
            value={author}
            onChangeText={setAuthor}
          />

          <TextInput
            style={styles.input}
            placeholder="Institution (Optional)"
            placeholderTextColor={colors.textTertiary}
            value={institution}
            onChangeText={setInstitution}
          />

          {/* Action Button */}
          <Button
            title="🔐 Notarize & Sign"
            onPress={handleNotarize}
            disabled={!document || !author}
          />
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
    marginBottom: spacing.xl,
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.aquaPrimary,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  uploadText: {
    ...typography.bodyLarge,
    color: colors.aquaPrimary,
    fontWeight: '600',
  },
  uploadSubtext: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
    marginVertical: spacing.sm,
  },
  previewCard: {
    marginBottom: spacing.xl,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  previewMeta: {
    ...typography.bodyRegular,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.headline2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  rippleContainer: {
    marginBottom: spacing.xl,
  },
  loadingTitle: {
    ...typography.headline1,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  progressList: {
    width: '100%',
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    color: colors.aquaPrimary,
  },
  progressText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
  },
});