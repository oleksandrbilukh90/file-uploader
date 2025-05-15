import { useRef, useState } from 'react';

export default function Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

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
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}