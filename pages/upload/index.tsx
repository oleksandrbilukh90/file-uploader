import { useRef, useState, useEffect } from 'react';
import { uploadFile } from '@/utils/uploadQueue';

export default function Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
            }
        });
        });
    }
    }, [files, uploading, progressMap]);

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div onDrop={(e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    }} onDragOver={(e) => e.preventDefault()} style={{ border: '2px dashed gray', padding: 40 }}>
      <h1>Drag and Drop Files Here</h1>
      <button onClick={() => fileInputRef.current?.click()}>Select Files</button>
      <input type="file" multiple hidden ref={fileInputRef} onChange={(e) => handleFiles(e.target.files!)} />

      <ul>
        {files.map((file, idx) => (
            <li key={idx}>
                {file.name} — {progressMap[file.name] ?? 0}%
            </li>
            ))}
      </ul>
    </div>
  );
}