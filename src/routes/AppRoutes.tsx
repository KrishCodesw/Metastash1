import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import Mediator from '@/pages/Mediator';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route
        path="/"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Home />
          </motion.div>
        }
      />
      
      {/* Mediator Route */}
      <Route
        path="/mediator"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Mediator />
          </motion.div>
        }
      />
      
      {/* SignIn Route */}
      <Route
        path="/signin"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignIn />
          </motion.div>
        }
      />

      {/* SignUp Route */}
      <Route
        path="/signup"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignUp />
          </motion.div>
        }
      />

      {/* Protected Route */}
      <Route
        path='/dashboard/:id'
        element={
          <ProtectedRoute>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard />
            </motion.div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
