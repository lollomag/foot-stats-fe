'use client';

import { useState } from 'react';
import { loginUser } from '../../lib/strapi';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';

const LoginPage: React.FC = () => {
  const { refreshUser } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(identifier, password);
      Cookies.set('jwt', response.jwt, { expires: 7 });
      setError(null);
      await refreshUser();
      router.push('/statistiche-personali');
    } catch (err) {
      setError('Errore durante il login. Riprova.');
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <Label>Email o Username</Label>
          <Input
            type="text"
            placeholder="Email o Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Accedi</Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default LoginPage;
