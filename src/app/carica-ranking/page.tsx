"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

export default function UploadRanking() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Seleziona un file prima di caricare.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post("/api/ranking/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message || 'File caricato con successo!');
    } catch (error) {
      setMessage('Errore durante il caricamento del file.');
      console.info(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Carica il Ranking</h2>
        <Input type="file" accept=".json" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={loading} className="mt-4">
          {loading ? 'Caricamento...' : 'Carica File'}
        </Button>
        {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
      </CardContent>
    </Card>
  );
}
