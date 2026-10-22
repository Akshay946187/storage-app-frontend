import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {loginWithGoogle} from '../utiles/loginWithGoogle.ts'

interface User {
    email:string;
    password:string;
}

const Login = () => {
    const [data , setData] = useState<User>({
        email:'',
        password:''
    })
    const [errors,setErrors] = useState<Partial<User>>({})
    const navigate = useNavigate()

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value} = e.target;
        setData({
            ...data,[name]:value
        })
    }

    const validation = ()=>{
        const Errors : Partial<User> = {}
        if(!data.email || !/\S+@\S+\.\S+/.test(data.email)){
            Errors.email = "email must be valid "
        }
        if(!data.password || data.password.length < 6){
            Errors.password = "password must be 6 Char."
        }
        setErrors(Errors)
        return Object.keys(Errors).length === 0 ;
    }

    const handleSubmit =async (e : React.ChangeEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(validation()){
            const response = await fetch('http://localhost:3000/user/login',{
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json',
                   
                },
                credentials:'include'
            })
            const resdata = await response.json()
            navigate('/')
        }else {
            console.log('form have errors')
        }
       
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        {/* Header with Signup Navigation */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <button 
            onClick={() => navigate('/signup')}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input 
              type="text" 
              name='email' 
              id="email"
              placeholder='Enter your email' 
              value={data.email} 
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
            />
            {errors.email && (
              <span className="text-sm text-red-500 font-medium">{errors.email}</span>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input 
              type="password" 
              name='password' 
              id="password"
              placeholder='Enter your password (min 6 characters)' 
              value={data.password} 
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
            />
            {errors.password && (
              <span className="text-sm text-red-500 font-medium">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            Log In
          </button>
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
            onSuccess={async (credentialResponse) => {
              const data = await loginWithGoogle(credentialResponse.credential || "")
              console.log(data)
              if(data.message){
                navigate('/')
              }else{
                console.log("something went wrong")
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login