import { Button } from "antd";

function NoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Oops! Page not found
        </h2>
        <p className="text-gray-500 mt-2">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Button
          type="primary"
          className="mt-6 px-6 py-2 text-lg font-medium"
          onClick={() => (window.location.href = "/")}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}

export default NoPage;