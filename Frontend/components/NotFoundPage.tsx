interface NotFoundPageProps {
  errorMessage?: string;
}

const NotFoundPage = ({ errorMessage }: NotFoundPageProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold text-base-content text-center">
        404 - Page Not Found
      </h1>
      <h2 className="text-xl font-bold text-error text-center">
        {errorMessage
          ? errorMessage
          : 'The page you are looking for does not exist.'}
      </h2>
    </div>
  );
};

export default NotFoundPage;
