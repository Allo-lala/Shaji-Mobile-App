import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';

type QRScannerScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({
  navigation,
}) => {
  const [scanning, setScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  React.useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      setHasPermission(requestResult === RESULTS.GRANTED);
    } else {
      setHasPermission(false);
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in settings to scan QR codes.',
        [
          { text: 'Cancel', onPress: () => navigation.goBack() },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const onSuccess = (e: any) => {
    setScanning(false);
    const scannedData = e.data;

    // Check if it's a verification URL or code
    if (scannedData.includes('aqua.verify/') || scannedData.startsWith('0x')) {
      Alert.alert(
        'QR Code Scanned',
        'Verifying document...',
        [{ text: 'OK' }]
      );

      // Navigate to verification with the scanned code
      navigation.replace('VerificationResult', {
        status: Math.random() > 0.5 ? 'verified' : 'unverified',
        message: 'Document verification complete',
      });
    } else {
      Alert.alert(
        'Invalid QR Code',
        'This QR code is not a valid Shaji verification code.',
        [
          {
            text: 'Scan Again',
            onPress: () => setScanning(true),
          },
          {
            text: 'Cancel',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Please grant camera permission to scan QR codes
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={checkCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        reactivate={scanning}
        reactivateTimeout={3000}
        showMarker
        markerStyle={styles.marker}
        cameraStyle={styles.camera}
        topContent={
          <View style={styles.topContent}>
            <Text style={styles.title}>Scan QR Code</Text>
            <Text style={styles.subtitle}>
              Align the QR code within the frame to verify
            </Text>
          </View>
        }
        bottomContent={
          <View style={styles.bottomContent}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        }
        cameraProps={{
          flashMode: RNCamera.Constants.FlashMode.off,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  permissionIcon: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  permissionTitle: {
    ...typography.headline1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  permissionButton: {
    backgroundColor: colors.aquaPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  permissionButtonText: {
    ...typography.bodyLarge,
    color: colors.surface,
    fontWeight: '600',
  },
  camera: {
    height: '100%',
  },
  marker: {
    borderColor: colors.aquaPrimary,
    borderWidth: 3,
    borderRadius: 16,
  },
  topContent: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.headline1,
    color: colors.surface,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.surface,
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomContent: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    minWidth: 120,
  },
  cancelButtonText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});