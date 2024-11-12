export class FileDownloadService {
  static downloadFile(blob: Blob, fileName: string, type: string) {
    const url = URL.createObjectURL(new Blob([blob], { type }));
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }
}
