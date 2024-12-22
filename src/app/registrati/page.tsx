'use client';

import { useState } from 'react';
import { registerUser } from '../../lib/strapi';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(username, email, password);
      setSuccess('Registrazione completata! Ora puoi effettuare il login.');
      setError(null);
      setTimeout(() => router.push('/accedi'), 2000);
    } catch (err) {
      setError('Errore durante la registrazione. Riprova.');
      setSuccess(null);
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Registrati</h1>
      <form className="space-y-4" onSubmit={handleRegister}>
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Registrati</Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default RegisterPage;
