"use client"
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

export default withPageAuthRequired(function MyStats() {
  return <div>Confronta giocatori</div>;
});