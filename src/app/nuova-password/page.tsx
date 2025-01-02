'use client';
import ResetPasswordForm from '@/components/AuthForms/ResetPassword';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto my-8">
        <h1 className="text-2xl font-bold mb-4">Reimposta Password</h1>
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
}