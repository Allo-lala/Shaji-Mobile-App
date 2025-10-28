import { useState, useEffect } from 'react';
import aquaService from '../services/aquaService';

export const useAquaSDK = () => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      setLoading(true);
      await aquaService.initialize();
      setInitialized(true);
    } catch (err) {
      setError('Failed to initialize Aqua SDK');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const notarize = async (filePath: string, metadata: any) => {
    try {
      setLoading(true);
      setError(null);
      const proof = await aquaService.notarizeDocument(filePath, metadata);
      return proof;
    } catch (err) {
      setError('Notarization failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (filePath: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await aquaService.verifyDocument(filePath);
      return result;
    } catch (err) {
      setError('Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    initialized,
    loading,
    error,
    notarize,
    verify,
  };
};