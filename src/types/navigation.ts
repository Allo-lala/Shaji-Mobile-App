import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { Document, DocumentStatus } from './index';

// Define all routes and their params
export type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  VerificationResult: {
    status: DocumentStatus;
    document?: Document;
    message?: string;
  };
  Vault: undefined;
  ShareProof: {
    document: Document;
  };
};

// Helper types for convenience
export type RootNavigationProp<
  T extends keyof RootStackParamList
> = NativeStackNavigationProp<RootStackParamList, T>;

export type RootRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
