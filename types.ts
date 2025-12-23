export interface FileRecord {
  id: string;
  name: string;
  data: string; // Base64 encoded PDF
  createdAt: number;
}

export interface AccessToken {
  fileId: string;
  expiresAt: number;
}

// Props for the PDF Viewer
export interface PdfViewerProps {
  file: string | { data: any }; // Can be a URL string or a generic object/base64
  fileName: string;
  expiresAt: number;
}

export enum AppRoute {
  HOME = 'HOME',
  VIEWER = 'VIEWER',
  EXPIRED = 'EXPIRED',
  NOT_FOUND = 'NOT_FOUND',
}