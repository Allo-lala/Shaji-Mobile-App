export type DocumentStatus = 'verified' | 'unverified' | 'pending' | 'error';

export interface Document {
  id: string;
  title: string;
  author: string;
  institution?: string;
  timestamp: number;
  hash: string;
  status: DocumentStatus;
  witnesses?: number;
  filePath: string;
  fileSize: number;
  pageCount?: number;
  aquaProof?: AquaProof;
}

export interface AquaProof {
  notarizationId: string;
  signature: string;
  timestamp: number;
  witnesses: Witness[];
  merkleRoot: string;
}

export interface Witness {
  id: string;
  signature: string;
  timestamp: number;
}

export interface VerificationResult {
  isValid: boolean;
  status: DocumentStatus;
  document?: Document;
  message: string;
}