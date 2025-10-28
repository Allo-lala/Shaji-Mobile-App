import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Document } from '../types';

const STORAGE_KEY = '@shaji:documents';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = useCallback(async (document: Document) => {
    try {
      const updated = [...documents, document];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDocuments(updated);
      return true;
    } catch (err) {
      setError('Failed to save document');
      console.error(err);
      return false;
    }
  }, [documents]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      const updated = documents.filter(doc => doc.id !== documentId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDocuments(updated);
      return true;
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
      return false;
    }
  }, [documents]);

  const updateDocument = useCallback(async (documentId: string, updates: Partial<Document>) => {
    try {
      const updated = documents.map(doc =>
        doc.id === documentId ? { ...doc, ...updates } : doc
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDocuments(updated);
      return true;
    } catch (err) {
      setError('Failed to update document');
      console.error(err);
      return false;
    }
  }, [documents]);

  const getDocument = useCallback((documentId: string) => {
    return documents.find(doc => doc.id === documentId);
  }, [documents]);

  return {
    documents,
    loading,
    error,
    saveDocument,
    deleteDocument,
    updateDocument,
    getDocument,
    refresh: loadDocuments,
  };
};