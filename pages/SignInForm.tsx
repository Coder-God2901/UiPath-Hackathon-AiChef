import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface SignInFormProps {
  onSignIn: (email: string) => void;
  onGoToSignUp: () => void;
}

export function SignInForm({ onSignIn, onGoToSignUp }: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(formData.email);
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold text-fresh-green">
            🥗 Smart Recipe
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Welcome back to healthy cooking!
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Sign in */}
            <Button type="submit" className="w-full bg-fresh-green text-white">
              Sign In
            </Button>

            {/* Links */}
            <div className="text-center space-y-3">
              <button
                type="button"
                className="text-sm text-soft-violet hover:underline"
              >
                Forgot Password?
              </button>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-muted-foreground">
                  Don&apos;t have an account?
                </span>
                <button
                  type="button"
                  onClick={onGoToSignUp}
                  className="text-fresh-green hover:underline font-medium"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="w-full">
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full">
                Phone OTP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
