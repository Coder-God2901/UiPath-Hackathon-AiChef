import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heart, Clock, ArrowLeft, Users, CheckCircle } from 'lucide-react';
import { Recipe } from '../App';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface RecipeDetailProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onRecipeTried: (recipeId: string) => void;
  onNavigate: (screen: 'recipes' | 'home') => void;
}

export function RecipeDetail({
  recipe,
  isFavorite,
  onToggleFavorite,
  onRecipeTried,
  onNavigate
}: RecipeDetailProps) {
  const handleMarkAsTried = () => {
    onRecipeTried(recipe.id);
    // Show success feedback (in real app, might show toast)
  };

  // Function to get the correct image source
  const getImageSrc = (recipe: Recipe) => {
    if (recipe.image === 'real-egg-curry') {
      return 'https://example.com/path/to/egg-curry-image.png';
    }
    return `https://images.unsplash.com/800x400/?${recipe.image}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => onNavigate('recipes')}
            className="flex items-center space-x-1"
          >
            <ArrowLeft size={16} />
            <span>Back to Recipes</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => onToggleFavorite(recipe.id)}
            className="flex items-center space-x-1"
            style={{ color: isFavorite ? '#FF4C4C' : '#666' }}
          >
            <Heart size={16} fill={isFavorite ? '#FF4C4C' : 'none'} />
            <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Hero Section */}
        <Card className="mb-6">
          <div className="relative">
            <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
              <img
                src={getImageSrc(recipe)}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <Badge 
                className="text-sm px-3 py-1"
                style={{ 
                  backgroundColor: recipe.isVegetarian ? '#4CAF50' : '#FF4C4C',
                  color: 'white'
                }}
              >
                {recipe.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
              </Badge>
              {recipe.cuisine === 'Indian' && (
                <Badge 
                  className="text-sm px-3 py-1"
                  style={{ backgroundColor: '#8E24AA', color: 'white' }}
                >
                  🇮🇳 Indian Cuisine
                </Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-medium mb-2">{recipe.name}</h1>
                <p className="text-muted-foreground">{recipe.cuisine} • {recipe.cookingTime} minutes</p>
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-lg font-medium" style={{ color: '#FFC107' }}>🔥 {recipe.calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-medium" style={{ color: '#4CAF50' }}>{recipe.proteins}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-medium text-blue-600">{recipe.carbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-medium" style={{ color: '#8E24AA' }}>
                  <Users size={16} className="inline mr-1" />2
                </div>
                <div className="text-sm text-muted-foreground">Servings</div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleMarkAsTried}
              className="w-full mb-4 text-lg py-3"
              style={{ backgroundColor: '#4CAF50' }}
            >
              <CheckCircle className="mr-2" size={20} />
              Did you cook this today?
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋 Ingredients</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{ingredient.name}</span>
                    <span className="text-sm text-muted-foreground">{ingredient.quantity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>👨‍🍳 Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                      style={{ backgroundColor: '#4CAF50' }}
                    >
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section - Enhanced for Indian dishes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💡 Cooking Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-1" style={{ color: '#4CAF50' }}>🔥 Perfect Heat</h4>
                <p className="text-muted-foreground">
                  {recipe.cuisine === 'Indian' 
                    ? 'Use medium heat for Indian gravies to prevent burning spices' 
                    : 'Use medium-high heat for best results with this recipe'
                  }
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium mb-1" style={{ color: '#FFC107' }}>⏰ Prep Ahead</h4>
                <p className="text-muted-foreground">
                  {recipe.cuisine === 'Indian' 
                    ? 'Prepare your spice mix (masala) in advance for smoother cooking' 
                    : 'Marinate proteins 30 minutes before cooking for extra flavor'
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium mb-1" style={{ color: '#8E24AA' }}>🥗 Serving</h4>
                <p className="text-muted-foreground">
                  {recipe.cuisine === 'Indian' 
                    ? 'Best served hot with basmati rice or fresh rotis' 
                    : 'Pair with a fresh salad for a complete balanced meal'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}