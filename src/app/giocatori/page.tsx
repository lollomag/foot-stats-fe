"use client"
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

export default withPageAuthRequired(function Players({ user }) {
  return <div>Players</div>;
});