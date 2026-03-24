import VerifyEmailFormWrapper from '@/components/auth/VerifyEmailFormWrapper';

export default async function VerifyEmailPage({ params }) {
  const { token } = await params;
  
  return (
    <div className="verify-email-page">
      <VerifyEmailFormWrapper token={token} />
    </div>
  );
}
