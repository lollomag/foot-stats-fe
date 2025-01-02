'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPassword } from '@/lib/strapi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await forgotPassword({email})

      if (res.ok) {
        setMessage('Controlla la tua email per reimpostare la password.');
      } else {
        const error = await res.json();
        setMessage(error.message || 'Errore durante il recupero della password.');
      }
    } catch (err) {
      setMessage('Errore durante il recupero della password.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Recupera Password</h1>
      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="mt-4">
          Recupera Password
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
