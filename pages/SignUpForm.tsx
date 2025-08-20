import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { User } from '../App';

interface SignUpFormProps {
  onSignUp: (userData: Omit<User, 'id'>) => void;
  onGoToSignIn: () => void;
}

export function SignUpForm({ onSignUp, onGoToSignIn }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: '',
    isVegetarian: false,
    allergies: '',
    dislikes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData: Omit<User, 'id'> = {
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      weight: parseInt(formData.weight),
      height: parseInt(formData.height),
      preferences: {
        isVegetarian: formData.isVegetarian,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(Boolean),
        dislikes: formData.dislikes.split(',').map(d => d.trim()).filter(Boolean)
      }
    };
    
    onSignUp(userData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F9F9F9' }}>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl" style={{ color: '#4CAF50' }}>
            🥗 Smart Recipe
          </CardTitle>
          <p className="text-muted-foreground">Create your healthy cooking profile</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Health Profile */}
            <div className="border-t pt-4">
              <h3 className="mb-3">Health Profile</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Age"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="Weight"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="Height"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t pt-4 space-y-3">
              <h3>Dietary Preferences</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegetarian"
                  checked={formData.isVegetarian}
                  onCheckedChange={(checked) => handleInputChange('isVegetarian', checked as boolean)}
                />
                <Label htmlFor="vegetarian">I'm vegetarian</Label>
              </div>
              
              <div>
                <Label htmlFor="allergies">Allergies (comma separated)</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="e.g., nuts, dairy, shellfish"
                />
              </div>
              
              <div>
                <Label htmlFor="dislikes">Food Dislikes (comma separated)</Label>
                <Input
                  id="dislikes"
                  value={formData.dislikes}
                  onChange={(e) => handleInputChange('dislikes', e.target.value)}
                  placeholder="e.g., broccoli, mushrooms"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" style={{ backgroundColor: '#4CAF50' }}>
              Create Account
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={onGoToSignIn}
                className="text-sm hover:underline"
                style={{ color: '#8E24AA' }}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}