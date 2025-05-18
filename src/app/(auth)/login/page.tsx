// app/(auth)/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import { ApiService } from '@/api/api-service';
import { ApiEndpoints } from '@/api/endpoints';
import { AlertTriangle, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Home from '@/app/page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export type SiteLocation = {
    _id: string;
    siteName: string;
};

export default function LoginPage() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [siteLocation, setSiteLocation] = useState('');
    const [sites, setSites] = useState<SiteLocation[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { login, isLoggedIn, isLoading: isAuthLoading } = useAuth();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        initLoggedIn();


        const getSiteLocations = async () => {
            setIsLoading(true)
            try {
                const response = await ApiService.get(ApiEndpoints.SITELOCATION);
                if (response?.data?.data) {
                    setSites(response.data.data);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Site Location not found');
                }
            } catch (error) {
                console.log(error)
                setErrorMessage('Failed to load site locations');
            } finally {
                setIsLoading(false)
            }
        };

        getSiteLocations();


    }, [isLoggedIn]);

    useEffect(() => {
        if (!isAuthLoading && isLoggedIn) {
            router.replace('/');
        }
    }, [isAuthLoading, isLoggedIn, router]);

    const handleLogin = async () => {
        setErrorMessage('');
        try {
            const res = await ApiService.post(ApiEndpoints.AUTH_LOGIN, {
                fullName: name,
                password,
                site: siteLocation,
                isAdmin: true,
            });
            if (res.data.data.token != null) {
                login(res.data.data.token);
            }
        } catch (err) {
            if (
                err &&
                typeof err === 'object' &&
                'data' in err &&
                typeof (err as { data?: { message?: string } }).data?.message === 'string'
            ) {
                setErrorMessage((err as { data: { message: string } }).data.message);
            } else {
                setErrorMessage('Login failed');
            }
        } finally {
            initLoggedIn()
        }
    };

    const initLoggedIn = () => {
        if (isLoggedIn) {
            console.log('called here')

            router.replace('/')
        }
    }

    if (isLoading || isAuthLoading || isLoggedIn) {
        return (<div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        </div>)
    }


    return (
        <Card className="max-w-md mx-auto mt-20 shadow-lg">
            <CardHeader className="text-center">
                <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <h2 className="text-lg font-medium mt-2">Login</h2>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="site">Site</Label>
                    <Select value={siteLocation} onValueChange={setSiteLocation}>
                        <SelectTrigger id="site">
                            <SelectValue placeholder="Select a site" />
                        </SelectTrigger>
                        <SelectContent>
                            {sites.map((site) => (
                                <SelectItem key={site._id} value={site._id}>
                                    {site.siteName || '-'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>

                {errorMessage && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-100 p-2 rounded-md">
                        <AlertTriangle className="h-4 w-4" />
                        {errorMessage}
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <Button onClick={handleLogin} className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : null} {loading ? 'Logging in...' : 'Sign In'}
                </Button>
            </CardFooter>
        </Card>
    );
}
