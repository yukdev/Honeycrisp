interface UnauthorizedProps {
  errorMessage?: string;
}

const Unauthorized = ({ errorMessage }: UnauthorizedProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold text-base-content text-center">
        Unauthorized
      </h1>
      <h2 className="text-xl font-bold text-error text-center">
        {errorMessage
          ? errorMessage
          : 'You do not have permission to view this page.'}
      </h2>
    </div>
  );
};

export default Unauthorized;
