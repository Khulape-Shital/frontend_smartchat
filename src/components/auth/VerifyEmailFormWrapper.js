"use client"

import VerifyEmailForm from './VerifyEmailForm';

export default function VerifyEmailFormWrapper({ token }) {
  return <VerifyEmailForm token={token} />;
}
