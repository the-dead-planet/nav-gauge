import { useEffect, useState } from "react";
import { StorageFolder, StorageListing } from "./model";
import {
    getStorageDebugFolders,
    readStorageDebugFolder,
} from "./storage-files";

export const useStorageBrowser = () => {
    const [folders] = useState(getStorageDebugFolders);
    const [location, setLocation] = useState<{
        root: StorageFolder;
        path: string;
    } | null>(null);
    const [listing, setListing] = useState<StorageListing | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [revision, setRevision] = useState(0);

    useEffect(() => {
        setListing(null);
        setError(null);
        setLoading(!!location);
        if (!location) {
            return;
        }
        let isCurrent = true;
        void readStorageDebugFolder(location.root.path, location.path)
            .then((result) => {
                if (isCurrent) {
                    setListing(result);
                }
            })
            .catch((failure: unknown) => {
                if (isCurrent) {
                    setError(
                        failure instanceof Error
                            ? failure.message
                            : String(failure),
                    );
                }
            })
            .finally(() => {
                if (isCurrent) {
                    setLoading(false);
                }
            });
        return () => {
            isCurrent = false;
        };
    }, [location, revision]);

    const openFolder = (root: StorageFolder, path = root.path) => {
        setListing(null);
        setLocation({ root, path });
    };
    const goUp = () => {
        setListing(null);
        setLocation((current) =>
            current && current.path !== current.root.path
                ? {
                      ...current,
                      path: current.path.slice(
                          0,
                          current.path.lastIndexOf("/"),
                      ),
                  }
                : null,
        );
    };

    return {
        folders,
        location,
        listing,
        error,
        loading,
        openFolder,
        goUp,
        refresh: () => setRevision((value) => value + 1),
    };
};
