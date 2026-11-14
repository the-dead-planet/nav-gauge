export interface StorageFolder {
    label: string;
    path: string;
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
