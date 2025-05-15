import { useRef, useState, useEffect, useCallback } from 'react';
import { uploadFile } from '@/utils/uploadQueue';
import {
  DropZone,
  Button,
  ProgressBar,
  BlockStack,
  InlineStack,
  Card,
  Text,
  Page,
} from '@shopify/polaris';

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const MAX_CONCURRENT = 3;
  const [uploading, setUploading] = useState<File[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const idleFiles = files.filter(
      (f) => !uploading.includes(f) && !progressMap[f.name]
    );

    if (uploading.length < MAX_CONCURRENT && idleFiles.length > 0) {
      const toUpload = idleFiles.slice(0, MAX_CONCURRENT - uploading.length);
      toUpload.forEach((file) => {
        setUploading((prev) => [...prev, file]);

        uploadFile({
          file,
          onProgress: (p) => {
            setProgressMap((prev) => ({ ...prev, [file.name]: p }));
          },
          onComplete: () => {
            setUploading((prev) => prev.filter((f) => f !== file));
          },
        });
      });
    }
  }, [files, uploading, progressMap]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );

  return (
    <Page title="File Uploader">
      <Card>
        <DropZone
          onDrop={handleDropZoneDrop}
          variableHeight
        >
          <DropZone.FileUpload />
        </DropZone>
      </Card>

      {files.length > 0 && (
        <BlockStack gap="500">
          {files.map((file, idx) => (
            <Card key={idx}>
              <InlineStack align="start">
                <Text variant="bodyMd" as="span">
                  {file.name}
                </Text>
                <ProgressBar
                  progress={progressMap[file.name] ?? 0}
                  size="small"
                />
              </InlineStack>
            </Card>
          ))}
        </BlockStack>
      )}
    </Page>
  );
}
