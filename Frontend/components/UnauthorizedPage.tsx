interface UnauthorizedPageProps {
  errorMessage?: string;
}

const UnauthorizedPage = ({ errorMessage }: UnauthorizedPageProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold text-base-content text-center">
        401 - Unauthorized
      </h1>
      <h2 className="text-xl font-bold text-error text-center">
        {errorMessage
          ? errorMessage
          : 'You are not authorized to view this page.'}
      </h2>
    </div>
  );
};

export default UnauthorizedPage;
