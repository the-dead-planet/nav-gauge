export interface StorageFolder {
    label: string;
    path: string;
    isDownload?: boolean;
}

export interface StorageEntry {
    name: string;
    path: string;
    size: number;
    modified?: Date;
    isDirectory: boolean;
}

export interface StorageListing {
    entries: StorageEntry[];
    exists: boolean;
}

export type StorageFolderSummary =
    | { status: "loading" | "missing" | "unavailable" }
    | {
          status: "ready";
          files: number;
          folders: number;
          totalBytes: number;
          imageFiles: number;
          imageBytes: number;
          asyncStorageFiles: number;
          asyncStorageBytes: number;
      };

export interface StorageFileTotal {
    files: number;
    bytes: number;
}
