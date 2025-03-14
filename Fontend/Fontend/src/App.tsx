import '@ant-design/v5-patch-for-react-19';
import './App.css';

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Hello, <span className="text-purple-600">World!</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome to your beautiful TailwindCSS design.
        </p>
        <button className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-pink-700 transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;
