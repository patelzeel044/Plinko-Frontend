
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAccount, userLogin } from '../store/Slices/authSlice';


export default function SignupPopup(/* { onClose } */) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const password = watch('password', '');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);

  const onSubmit = async (data) => {
    const response = await dispatch(createAccount(data));
    if (response?.payload?.success) {
        const username = data?.username;
        const password = data?.password;
        const loginResult = await dispatch(
            userLogin({ username, password })
        );

        if (loginResult?.type === "login/fulfilled") {
            navigate("/");
        } else {
            navigate("/login");
        }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl p-6 space-y-6">
        {/* Exit Button */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          Exit
        </button> */}

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Join Plinko.<span className="text-blue-500">com</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <Input
            label="Full Name"
            placeholder="Your full name"
            {...register('fullName', { required: 'Full Name is required' })}
            error={errors.fullName}
          />

          {/* Username */}
          <Input
            label="Username"
            placeholder="Choose a username"
            {...register('username', { required: 'Username is required' })}
            error={errors.username}
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email'
              }
            })}
            error={errors.email}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                  message: 'Password must be 8-16 characters, with atleast one character as uppercase, lowercase, number, and special character'
                }
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

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              className="absolute inset-y-0 right-3 mt-3 flex items-center text-gray-400 hover:text-gray-200 transition"
            >
              {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
          >
            Sign up
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400 space-y-2">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-white font-semibold hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
