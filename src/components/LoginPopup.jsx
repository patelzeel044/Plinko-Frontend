import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, userLogin } from '../store/Slices/authSlice';

export default function LoginPopup(/* { onClose } */) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth?.loading);

  const onSubmit = async (data) => {
    const isEmail = data.email.includes("@");
        const loginData = isEmail 
                            ? data 
                            : { username: data.email, password: data.password };

        const response = await dispatch(userLogin(loginData));
        const user = await dispatch(getCurrentUser());
        
        if (user?.payload?.role === 'user' && response?.payload?.role === 'user') {
            navigate("/");
        }
        if (user?.payload?.role === 'admin' && response?.payload?.role === 'admin') {
            navigate("/admin");
        }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl p-6 space-y-6">
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          Exit
        </button> */}

        <h1 className="text-3xl font-bold text-white mb-4">
          Plinko.<span className="text-blue-500">com</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
          <Input
            label="Email or Username"
            placeholder="you@example.com"
            {...register('email', { required: 'Email or username is required' })}
            error={errors.email }
          />

          <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required',
})}
            error={errors.password}
            />

            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-3 mt-3 flex items-center text-gray-400 hover:text-gray-200 transition"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400 space-y-2">
          <p>
            Don’t have an account?{' '}
            <a href="/signup" className="text-white font-semibold hover:underline">
              Register an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
