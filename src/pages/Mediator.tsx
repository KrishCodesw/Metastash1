import { useNavigate } from 'react-router-dom';

const Mediator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="backdrop-blur-lg bg-white/5 text-white p-10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)] w-full max-w-md border border-white/10">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white via-purple-300 to-pink-400 text-transparent bg-clip-text">
          Welcome
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Choose an option to continue
        </p>
        <div className="flex flex-col gap-5">
          <button
            onClick={() => navigate('/signin')}
            className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg text-lg font-semibold tracking-wider transition-all duration-300 shadow-inner shadow-white/5"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg text-lg font-semibold tracking-wider transition-all duration-300 shadow-inner shadow-white/5"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-white/20 hover:bg-white/10 text-white py-3 rounded-lg text-lg font-semibold tracking-wider transition-all duration-300 shadow-inner shadow-white/5"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mediator;
