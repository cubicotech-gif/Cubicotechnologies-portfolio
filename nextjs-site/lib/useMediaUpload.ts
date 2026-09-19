'use client';

import { useCallback, useState } from 'react';

export interface UploadedMedia {
  url: string;
  filename: string;
  media_type: 'image' | 'video';
}

interface UploadState {
  uploading: boolean;
  /** 0-100, from the real XHR progress event. */
  progress: number;
  error: string | null;
}

/**
 * Uploads a file straight from the browser to Supabase storage using a signed
 * URL minted by /api/get-upload-url.
 *
 * The file never passes through a serverless function, which is what keeps
 * large lesson videos under Vercel's 4.5MB request body ceiling.
 */
export function useMediaUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null });
  }, []);

  const upload = useCallback(async (file: File): Promise<UploadedMedia | null> => {
    setState({ uploading: true, progress: 0, error: null });

    try {
      const urlResponse = await fetch('/api/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      const urlData = await urlResponse.json();
      if (!urlResponse.ok || !urlData.success) {
        throw new Error(urlData.error || 'Could not prepare the upload.');
      }

      // XHR rather than fetch: fetch cannot report upload progress.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', urlData.signedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('x-upsert', 'true');

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          setState((current) => ({
            ...current,
            progress: Math.round((event.loaded / event.total) * 100),
          }));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed (${xhr.status}). ${xhr.responseText || ''}`.trim()));
        };
        xhr.onerror = () => reject(new Error('Network error during upload.'));
        xhr.onabort = () => reject(new Error('Upload cancelled.'));
        xhr.send(file);
      });

      setState({ uploading: false, progress: 100, error: null });

      return {
        url: urlData.publicUrl,
        filename: urlData.filename,
        media_type: urlData.media_type,
      };
    } catch (error: any) {
      setState({
        uploading: false,
        progress: 0,
        error: error.message || 'Upload failed.',
      });
      return null;
    }
  }, []);

  return { ...state, upload, reset };
}
