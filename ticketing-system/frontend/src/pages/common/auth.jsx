import React, { useEffect, useState, useContext } from 'react';
import toast from "react-hot-toast";
import { data, useNavigate } from "react-router-dom";
import fetchApi from '../../lib/api';
import { ProfileContext } from '../../App';
import { LoaderCircle } from 'lucide-react';

export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const { profile, setProfile } = useContext(ProfileContext);
    const [disableAnimate, setDisableAnimate] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        setDisableAnimate(true);

        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries());

        if (!validateForm(formValues)) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        try {
            const options = {
                method: "POST",
                body: JSON.stringify(formValues)
            }

            const data = await fetchApi(`/api/auth/${isLogin ? 'login' : 'register'}`, options);

            if (data.success === true) {
                setProfile(data.user);
            } else {
                setDisableAnimate(false);
                throw data;
            }

            setDisableAnimate(false);
            navigate("/dashboard");

            // success Toast
            (() => toast.success(`Successfully ${isLogin ? 'log in' : "registered"}`))();

        } catch (error) {
            console.error(error);
        }

    }


    function validateForm(data) {
        if (!data.email?.trim()) return false;
        if (!data.password?.trim()) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) return false;

        if (data.password.length < 4) return false;

        if (!isLogin && !data.terms) return false;

        return true;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

            {/* Left Side: Branding & Value Prop */}
            <div className="hidden md:flex md:w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30" />

                <div className="relative z-10 flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 font-black">
                        S
                    </div>
                    SupportFlow
                </div>

                <div className="relative z-10 max-w-md">
                    <blockquote className="text-2xl font-medium leading-relaxed mb-6">
                        {isLogin
                            ? `"This platform has completely streamlined our team's entire development workflow. A total game-changer."`
                            : `"Setting up took less than 5 minutes. The automation tools alone are worth double the price."`
                        }
                    </blockquote>
                    <div>
                        <p className="font-semibold text-lg">Sarah Jenkins</p>
                        <p className="text-indigo-200 text-sm">Lead Ops @ TechCorp</p>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-indigo-200">
                    © 2026 SupportFlow Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Clean Auth Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="md:hidden mb-8 flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                            S
                        </div>
                        SupportFlow
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>

                    {/* Form */}
                    <form onSubmit={(e) => handleSubmit(e)} className="mt-8 space-y-5">

                        {/* Name Field */}
                        {isLogin ? "" : <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    placeholder="e.g. Jonny Sins"
                                    className="block w-full rounded-lg border-0 p-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>}

                        {/* ID / Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                                User ID / Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="name@company.com"
                                    className="block w-full rounded-lg border-0 p-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    placeholder="••••••••"
                                    className="block w-full rounded-lg border-0 p-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Terms Checkbox (Only shows on Registration) */}
                        {!isLogin && (
                            <div className="flex items-start">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                    <label htmlFor="terms" className="text-slate-600">
                                        I agree to the{' '}
                                        <a href="#" className="font-medium text-slate-900 hover:underline">Terms</a>
                                        {' '}and{' '}
                                        <a href="#" className="font-medium text-slate-900 hover:underline">Privacy Policy</a>.
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                                disabled={disableAnimate}
                            >
                                {disableAnimate ? <LoaderCircle className="animate-spin" /> : isLogin ? 'Sign In' : 'Register'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </div>
    );
}