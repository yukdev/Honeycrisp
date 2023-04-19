import React from 'react';

const Loading = () => {
  return (
    <div className="container min-h-screen">
      <h1 className="text-3xl font-bold text-center my-5">Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <div className="card w-96 bg-secondary text-secondary-content">
              <div className="card-body">
                <h2 className="card-title">Loading...</h2>
                <p>Host: Loading...</p>
                <div className="card-actions justify-end">
                  <button className="btn">Bill: Pending</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
