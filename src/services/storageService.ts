import AsyncStorage from '@react-native-async-storage/async-storage';
import { Document } from '../types';

class StorageService {
  private readonly DOCUMENTS_KEY = '@shaji:documents';
  private readonly SETTINGS_KEY = '@shaji:settings';

  async saveDocument(document: Document): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      documents.push(document);
      await AsyncStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Failed to save document:', error);
      throw error;
    }
  }

  async getAllDocuments(): Promise<Document[]> {
    try {
      const data = await AsyncStorage.getItem(this.DOCUMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load documents:', error);
      return [];
    }
  }

  async getDocument(id: string): Promise<Document | null> {
    try {
      const documents = await this.getAllDocuments();
      return documents.find(doc => doc.id === id) || null;
    } catch (error) {
      console.error('Failed to get document:', error);
      return null;
    }
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      const index = documents.findIndex(doc => doc.id === id);
      if (index !== -1) {
        documents[index] = { ...documents[index], ...updates };
        await AsyncStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(documents));
      }
    } catch (error) {
      console.error('Failed to update document:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const documents = await this.getAllDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      await AsyncStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.DOCUMENTS_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }
}

export default new StorageService();