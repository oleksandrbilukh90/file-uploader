type UploadTask = {
  file: File;
  onProgress: (p: number) => void;
  onComplete: () => void;
};

export function uploadFile(task: UploadTask) {
  const { file, onProgress, onComplete } = task;
  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    onProgress(progress);
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(onComplete, 300);
    }
  }, 100);
}