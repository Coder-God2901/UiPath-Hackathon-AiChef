import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react';
import { HistoryItem } from '../App';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import eggCurryImage from '../public/eggCurry.png';

interface UserHistoryProps {
  history: HistoryItem[];
  onNavigate: (screen: 'home' | 'profile') => void;
}

// Updated mock recipe data for history display - includes all new recipes with real egg curry image
const mockRecipeData: { [key: string]: any } = {
  '1': {
    name: 'Mediterranean Chicken Bowl',
    image: 'mediterranean chicken bowl',
    cuisine: 'Mediterranean',
    calories: 420,
    isVegetarian: false
  },
  '2': {
    name: 'Vegetarian Stir Fry',
    image: 'vegetarian stir fry',
    cuisine: 'Asian',
    calories: 320,
    isVegetarian: true
  },
  '3': {
    name: 'Garlic Herb Chicken',
    image: 'garlic herb chicken',
    cuisine: 'Italian',
    calories: 380,
    isVegetarian: false
  },
  '4': {
    name: 'Mixed Vegetable Curry',
    image: 'mixed vegetable curry indian',
    cuisine: 'Indian',
    calories: 280,
    isVegetarian: true
  },
  '5': {
    name: 'Aloo Gobi (Potato & Cauliflower Stir Fry)',
    image: 'aloo gobi indian potato cauliflower',
    cuisine: 'Indian',
    calories: 250,
    isVegetarian: true
  },
  '6': {
    name: 'Palak Paneer (Spinach & Cottage Cheese)',
    image: 'palak paneer indian spinach',
    cuisine: 'Indian',
    calories: 320,
    isVegetarian: true
  },
  '7': {
    name: 'Egg Bhurji (Indian Scrambled Eggs)',
    image: 'egg bhurji indian scrambled eggs',
    cuisine: 'Indian',
    calories: 290,
    isVegetarian: false
  },
  '8': {
    name: 'Chicken Biryani (Simple One-Pot)',
    image: 'chicken biryani indian rice',
    cuisine: 'Indian',
    calories: 520,
    isVegetarian: false
  },
  '9': {
    name: 'Egg Curry',
    image: 'real-egg-curry', // Special marker for the real image
    cuisine: 'Indian',
    calories: 340,
    isVegetarian: false
  },
  '10': {
    name: 'Spicy Chicken Fry',
    image: 'spicy chicken fry indian',
    cuisine: 'Indian',
    calories: 380,
    isVegetarian: false
  }
};

export function UserHistory({ history, onNavigate }: UserHistoryProps) {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  const handleRateRecipe = (historyItem: HistoryItem) => {
    setSelectedItem(historyItem);
    setRating(historyItem.rating || 0);
    setNotes(historyItem.notes || '');
  };

  const handleSaveRating = () => {
    if (selectedItem) {
      // In real app, would update the history item with rating and notes
      console.log('Saving rating:', rating, 'notes:', notes, 'for item:', selectedItem.id);
      setSelectedItem(null);
    }
  };

  // Function to get the correct image source
  const getImageSrc = (recipe: any) => {
    if (recipe.image === 'real-egg-curry') {
      // If eggCurryImage is a StaticImageData, use its src property
      return typeof eggCurryImage === 'string' ? eggCurryImage : eggCurryImage.src;
    }
    return `https://images.unsplash.com/150x150/?${recipe.image}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  // Group history by date
  const groupedHistory = history.reduce((groups: { [key: string]: HistoryItem[] }, item) => {
    const date = new Date(item.dateTried).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Calculate cuisine stats
  const cuisineStats = history.reduce((stats: { [key: string]: number }, item) => {
    const recipe = mockRecipeData[item.recipeId];
    if (recipe) {
      stats[recipe.cuisine] = (stats[recipe.cuisine] || 0) + 1;
    }
    return stats;
  }, {});

  const favoriteRecipes = history.filter(h => h.rating && h.rating >= 4);
  const totalIndianRecipes = cuisineStats['Indian'] || 0;

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
            <h1 className="text-xl" style={{ color: '#4CAF50' }}>🕘 Your Cooking History</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {history.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">👨‍🍳</div>
              <h3 className="text-lg mb-2">No cooking history yet</h3>
              <p className="text-muted-foreground mb-4">
                Start cooking recipes and mark them as "tried" to build your cooking history!
              </p>
              <Button 
                onClick={() => onNavigate('home')}
                style={{ backgroundColor: '#4CAF50' }}
              >
                Find Recipes to Cook
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Your Cooking Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-medium" style={{ color: '#4CAF50' }}>
                      {history.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Recipes Tried</div>
                  </div>
                  <div>
                    <div className="text-2xl font-medium" style={{ color: '#FFC107' }}>
                      {favoriteRecipes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Loved Recipes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-medium" style={{ color: '#8E24AA' }}>
                      {Object.keys(groupedHistory).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Cooking Days</div>
                  </div>
                  <div>
                    <div className="text-2xl font-medium" style={{ color: '#FF4C4C' }}>
                      {totalIndianRecipes}
                    </div>
                    <div className="text-sm text-muted-foreground">🇮🇳 Indian Dishes</div>
                  </div>
                </div>

                {/* Cuisine Breakdown */}
                {Object.keys(cuisineStats).length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Your Cuisine Journey</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(cuisineStats).map(([cuisine, count]) => (
                        <Badge 
                          key={cuisine} 
                          variant="secondary"
                          className="flex items-center space-x-1"
                          style={{ 
                            backgroundColor: cuisine === 'Indian' ? '#8E24AA' : '#4CAF50',
                            color: 'white'
                          }}
                        >
                          <span>{cuisine === 'Indian' ? '🇮🇳' : '🌍'}</span>
                          <span>{cuisine}: {count}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History Items */}
            {Object.entries(groupedHistory)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, items]) => (
                <div key={date}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar size={16} className="text-muted-foreground" />
                    <h3 className="font-medium">{formatDate(items[0].dateTried)}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item) => {
                      const recipe = mockRecipeData[item.recipeId];
                      if (!recipe) return null;

                      return (
                        <Card key={item.id} className="hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={getImageSrc(recipe)}
                                  alt={recipe.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium mb-1">{recipe.name}</h4>
                                    <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-2">
                                      <span className="flex items-center space-x-1">
                                        {recipe.cuisine === 'Indian' && <span>🇮🇳</span>}
                                        <span>{recipe.cuisine}</span>
                                      </span>
                                      <Badge 
                                        variant="secondary"
                                        className="text-xs"
                                        style={{ 
                                          backgroundColor: recipe.isVegetarian ? '#4CAF50' : '#FF4C4C',
                                          color: 'white'
                                        }}
                                      >
                                        {recipe.isVegetarian ? 'Veg' : 'Non-Veg'}
                                      </Badge>
                                      <span style={{ color: '#FFC107' }}>
                                        🔥 {recipe.calories} cal
                                      </span>
                                    </div>
                                    
                                    {item.rating && (
                                      <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            size={14}
                                            fill={star <= item.rating! ? '#FFC107' : 'none'}
                                            className={star <= item.rating! ? 'text-yellow-400' : 'text-gray-300'}
                                          />
                                        ))}
                                        <span className="text-xs text-muted-foreground ml-2">
                                          Your rating
                                        </span>
                                      </div>
                                    )}
                                    
                                    {item.notes && (
                                      <p className="text-sm text-muted-foreground mt-2 italic">
                                        "{item.notes}"
                                      </p>
                                    )}
                                  </div>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRateRecipe(item)}
                                    className="flex items-center space-x-1"
                                  >
                                    <Star size={14} />
                                    <span>{item.rating ? 'Edit' : 'Rate'}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Rate Your Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">How was this recipe?</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={24}
                        fill={star <= rating ? '#FFC107' : 'none'}
                        className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Add Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you think? Any modifications you made?"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRating}
                  className="flex-1"
                  style={{ backgroundColor: '#4CAF50' }}
                >
                  Save Rating
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}