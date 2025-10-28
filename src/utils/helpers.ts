import { Platform } from 'react-native';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateHash = (hash: string, startChars: number = 10, endChars: number = 4): string => {
  if (hash.length <= startChars + endChars) return hash;
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};