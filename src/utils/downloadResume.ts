export async function downloadResume(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  try {
    const response = await fetch('/resume.pdf');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rishabh-shah-resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading resume:', error);
    try {
      // Fallback to direct download
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'rishabh-shah-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackError) {
      throw fallbackError;
    }
  }
}

