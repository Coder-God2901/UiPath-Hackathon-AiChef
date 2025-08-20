import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Edit, Save, X, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../App';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate: (screen: 'home') => void;
  onSignOut: () => void;
}

export function ProfilePage({ user, onUpdateUser, onNavigate, onSignOut }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    age: user.age.toString(),
    weight: user.weight.toString(),
    height: user.height.toString(),
    isVegetarian: user.preferences.isVegetarian,
    allergies: user.preferences.allergies.join(', '),
    dislikes: user.preferences.dislikes.join(', ')
  });

  const calculateBMI = () => {
    const heightInM = user.height / 100;
    const bmi = user.weight / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#FFC107' };
    if (bmi < 25) return { category: 'Normal', color: '#4CAF50' };
    if (bmi < 30) return { category: 'Overweight', color: '#FF9800' };
    return { category: 'Obese', color: '#FF4C4C' };
  };

  const calculateDailyCalories = () => {
    // Simplified BMR calculation (Mifflin-St Jeor Equation)
    const bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5; // For males
    const dailyCalories = Math.round(bmr * 1.5); // Moderate activity level
    return dailyCalories;
  };

  const handleSaveProfile = () => {
    const updatedUser: User = {
      ...user,
      name: editForm.name,
      age: parseInt(editForm.age),
      weight: parseInt(editForm.weight),
      height: parseInt(editForm.height),
      preferences: {
        isVegetarian: editForm.isVegetarian,
        allergies: editForm.allergies.split(',').map(a => a.trim()).filter(Boolean),
        dislikes: editForm.dislikes.split(',').map(d => d.trim()).filter(Boolean)
      }
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name,
      age: user.age.toString(),
      weight: user.weight.toString(),
      height: user.height.toString(),
      isVegetarian: user.preferences.isVegetarian,
      allergies: user.preferences.allergies.join(', '),
      dislikes: user.preferences.dislikes.join(', ')
    });
    setIsEditing(false);
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);
  const dailyCalories = calculateDailyCalories();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-1"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
            <h1 className="text-xl" style={{ color: '#4CAF50' }}>👤 Profile</h1>
          </div>
          
          <Button
            variant="outline"
            onClick={onSignOut}
            className="flex items-center space-x-1 text-red-600"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl text-white"
                  style={{ backgroundColor: '#4CAF50' }}
                >
                  <UserIcon size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-medium">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant="secondary"
                      style={{ 
                        backgroundColor: user.preferences.isVegetarian ? '#4CAF50' : '#FF4C4C',
                        color: 'white'
                      }}
                    >
                      {user.preferences.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Health Stats */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Health Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-medium">{user.age}</div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </div>
                <div>
                  <div className="text-lg font-medium">{user.weight}kg</div>
                  <div className="text-sm text-muted-foreground">Weight</div>
                </div>
                <div>
                  <div className="text-lg font-medium">{user.height}cm</div>
                  <div className="text-sm text-muted-foreground">Height</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">BMI</span>
                  <span className="text-lg font-medium">{calculateBMI()}</span>
                </div>
                <Badge 
                  className="w-full justify-center"
                  style={{ backgroundColor: bmiInfo.color, color: 'white' }}
                >
                  {bmiInfo.category}
                </Badge>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Daily Calories</span>
                  <div className="text-lg font-medium" style={{ color: '#FFC107' }}>
                    🔥 {dailyCalories}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended for moderate activity
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>🍽 Dietary Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.preferences.allergies.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.allergies.map((allergy, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="capitalize"
                        style={{ backgroundColor: '#FF4C4C', color: 'white' }}
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {user.preferences.dislikes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Dislikes</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.dislikes.map((dislike, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="capitalize"
                        style={{ backgroundColor: '#8E24AA', color: 'white' }}
                      >
                        {dislike}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {user.preferences.allergies.length === 0 && user.preferences.dislikes.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No dietary restrictions set
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Profile</CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  size="sm"
                  className="flex items-center space-x-1"
                  style={{ backgroundColor: '#4CAF50' }}
                >
                  <Save size={16} />
                  <span>Save</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-age">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-weight">Weight (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={editForm.weight}
                    onChange={(e) => setEditForm(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-height">Height (cm)</Label>
                  <Input
                    id="edit-height"
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-vegetarian"
                  checked={editForm.isVegetarian}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isVegetarian: checked as boolean }))}
                />
                <Label htmlFor="edit-vegetarian">I'm vegetarian</Label>
              </div>
              
              <div>
                <Label htmlFor="edit-allergies">Allergies (comma separated)</Label>
                <Input
                  id="edit-allergies"
                  value={editForm.allergies}
                  onChange={(e) => setEditForm(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="e.g., nuts, dairy, shellfish"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-dislikes">Food Dislikes (comma separated)</Label>
                <Input
                  id="edit-dislikes"
                  value={editForm.dislikes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, dislikes: e.target.value }))}
                  placeholder="e.g., broccoli, mushrooms"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}