/**
 * Download Utility
 * 
 * Handles file downloads from cross-origin URLs by fetching as blob.
 */

/**
 * Downloads a file from a URL (works with cross-origin like Cloudinary)
 * @param url - The file URL to download
 * @param filename - Suggested filename for the download
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
    try {
        // Fetch the file as a blob
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create temporary anchor and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
}
