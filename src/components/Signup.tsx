import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../utiles/loginWithGoogle';

interface FormData {
    name: string;
    email: string;
    password: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: 'akshay',
    email: 'aki748434@gmail.com',
    password: '123456',
  }); 

  const [verifyEmail , setVerifyEmail] = useState<boolean>(false)
  const [otp , setOtp] = useState<string>('')
  const [otpError , setOtpError] = useState<string>('')
  const [success , setSuccess] = useState<boolean>(false)

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const Navigate = useNavigate()
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(success){
      if (validateForm()) {
        const response = await fetch('http://localhost:3000/user/signup', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials:'include'   
        })
        const data = await response.json();
        if(response.status === 409){
          setErrors(formData.email = data.message)
        }
        if(response.status === 201){
          Navigate('/')
        }
      } else {
        console.log('Form has errors');
      }
    }
  };
  
  const sendOtp = async ()=>{
    const res = await fetch('http://localhost:3000/user/send-otp',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include'   
      })

    if(res.status == 201){
      setVerifyEmail(true)
    }
  }

  const handleVerify = async ()=>{
    const res = await fetch('http://localhost:3000/user/verify-otp',{
        method: 'POST',
         body:JSON.stringify({
        email:formData.email,
        otp
    }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include'   
      })
      const data = await res.json()
      if(res.status === 400){
       setOtpError(data.message)
       setSuccess(false)
      }else if(res.status === 200){
        setOtpError('')
        setSuccess(true)
      }
   console.log(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        {/* Header with Login Navigation */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <button 
            onClick={() => Navigate('/login')}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
          >
            Log In
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
            />
            {errors.name && <span className="text-sm text-red-500 font-medium">{errors.name}</span>}
          </div>

          <div className="space-y-1">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
                {errors.email && <span className="text-sm text-red-500 font-medium">{errors.email}</span>}
              </div>
              <button
                type="button"
                onClick={sendOtp}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap text-sm"
              >
                Send OTP
              </button>
            </div>
            
            {verifyEmail && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e:any)=>setOtp(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Verify
                  </button>
                </div>
                {!success && otpError && (
                  <p className="text-sm text-red-500 font-medium">{otpError}</p>
                )}
                {success && (
                  <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                    <span>✅</span> Email verified successfully!
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min 6 characters)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
            />
            {errors.password && <span className="text-sm text-red-500 font-medium">{errors.password}</span>}
          </div>

          {success && (
            <button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              Sign Up
            </button>
          )}
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm text-gray-500 font-medium">or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={credentialResponse => {
              loginWithGoogle(credentialResponse.credential as string)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => Navigate('/login')}
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;