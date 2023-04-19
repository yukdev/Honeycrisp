const Loading = () => {
  return (
    <div className="card">
      <div className="flex flex-col items-center justify-center container min-h-screen">
        <div className="w-full max-w-2xl">
          <h1 className="mb-4 text-center">
            <span className="inline-block h-8 w-48 bg-accent rounded-lg animate-pulse"></span>
          </h1>
          <h1 className="mb-4 text-center">
            <span className="inline-block h-6 w-24 bg-secondary rounded-lg animate-pulse"></span>
          </h1>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Item</th>
                <th>Price</th>
                <th>Eaten By</th>
                <th>Ate?</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((index) => (
                <tr key={index} className="hover text-center">
                  <td>{index}</td>
                  <td>
                    <span className="inline-block h-5 w-24 bg-gray-300 rounded-lg animate-pulse"></span>
                  </td>
                  <td>
                    <span className="inline-block h-5 w-16 bg-gray-300 rounded-lg animate-pulse"></span>
                  </td>
                  <td>
                    <span className="inline-block h-5 w-24 bg-gray-300 rounded-lg animate-pulse"></span>
                  </td>
                  <td>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                        />
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-primary my-3">Submit</button>
      </div>
    </div>
  );
};

export default Loading;
