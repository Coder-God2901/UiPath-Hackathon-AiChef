import React, { useState } from 'react';
import { SignUpForm } from './pages/SignUpForm';
import { SignInForm } from './pages/SignInForm';
import { HomeScreen } from './pages/HomeScreen';
import { RecipeSuggestions } from './pages/RecipeSuggestions';
import { RecipeDetail } from './pages/RecipeDetail';
import { UserHistory } from './pages/UserHistory';
import { ProfilePage } from './pages/ProfilePage';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  preferences: {
    isVegetarian: boolean;
    allergies: string[];
    dislikes: string[];
  };
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  isVegetarian: boolean;
  calories: number;
  proteins: number;
  carbs: number;
  ingredients: { name: string; quantity: string }[];
  instructions: string[];
  cookingTime: number;
}

export interface HistoryItem {
  id: string;
  recipeId: string;
  dateTried: string;
  rating?: number;
  notes?: string;
}

type Screen = 'signin' | 'signup' | 'home' | 'recipes' | 'recipe-detail' | 'history' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('signin');
  const [user, setUser] = useState<User | null>(null);
  const [groceries, setGroceries] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filters, setFilters] = useState({
    cuisine: 'all',
    isVegetarian: false,
    calorieRange: [0, 1000]
  });

  const handleSignUp = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    setUser(newUser);
    setCurrentScreen('home');
  };

  const handleSignIn = (email: string) => {
    // Mock sign in - in real app would validate credentials
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      age: 30,
      weight: 70,
      height: 175,
      preferences: {
        isVegetarian: false,
        allergies: ['nuts'],
        dislikes: ['broccoli']
      }
    };
    setUser(mockUser);
    setCurrentScreen('home');
  };

  const handleGrocerySubmit = (items: string[]) => {
    setGroceries(items);
    setCurrentScreen('recipes');
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentScreen('recipe-detail');
  };

  const handleRecipeTried = (recipeId: string) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      recipeId,
      dateTried: new Date().toISOString()
    };
    setHistory(prev => [historyItem, ...prev]);
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'signin':
        return (
          <SignInForm 
            onSignIn={handleSignIn}
            onGoToSignUp={() => setCurrentScreen('signup')}
          />
        );
      
      case 'signup':
        return (
          <SignUpForm 
            onSignUp={handleSignUp}
            onGoToSignIn={() => setCurrentScreen('signin')}
          />
        );
      
      case 'home':
        return (
          <HomeScreen 
            onGrocerySubmit={handleGrocerySubmit}
            onNavigate={navigateToScreen}
          />
        );
      
      case 'recipes':
        return (
          <RecipeSuggestions 
            groceries={groceries}
            filters={filters}
            onFiltersChange={setFilters}
            onRecipeSelect={handleRecipeSelect}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onNavigate={navigateToScreen}
          />
        );
      
      case 'recipe-detail':
        return selectedRecipe ? (
          <RecipeDetail 
            recipe={selectedRecipe}
            isFavorite={favorites.includes(selectedRecipe.id)}
            onToggleFavorite={toggleFavorite}
            onRecipeTried={handleRecipeTried}
            onNavigate={navigateToScreen}
          />
        ) : null;
      
      case 'history':
        return (
          <UserHistory 
            history={history}
            onNavigate={navigateToScreen}
          />
        );
      
      case 'profile':
        return user ? (
          <ProfilePage 
            user={user}
            onUpdateUser={setUser}
            onNavigate={navigateToScreen}
            onSignOut={() => {
              setUser(null);
              setCurrentScreen('signin');
            }}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
    </div>
  );
}