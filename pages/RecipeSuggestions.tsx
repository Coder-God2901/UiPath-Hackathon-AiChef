import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Heart, Clock, ArrowLeft, Filter } from 'lucide-react';
import { Recipe } from '../App';
// import { ImageWithFallback } from './figma/ImageWithFallback';
import eggCurryImage from '../public/eggCurry.png';

interface RecipeSuggestionsProps {
  groceries: string[];
  filters: {
    cuisine: string;
    isVegetarian: boolean;
    calorieRange: number[];
  };
  onFiltersChange: (filters: any) => void;
  onRecipeSelect: (recipe: Recipe) => void;
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
  onNavigate: (screen: 'home' | 'history' | 'profile') => void;
}

// Updated mock recipe data with new Indian dishes and real egg curry image
const mockRecipes: Recipe[] = [
  // Existing recipes
  {
    id: '1',
    name: 'Mediterranean Chicken Bowl',
    image: 'mediterranean chicken bowl',
    cuisine: 'Mediterranean',
    isVegetarian: false,
    calories: 420,
    proteins: 35,
    carbs: 28,
    ingredients: [
      { name: 'Chicken breast', quantity: '200g' },
      { name: 'Bell peppers', quantity: '1 cup' },
      { name: 'Tomatoes', quantity: '2 medium' },
      { name: 'Olive oil', quantity: '2 tbsp' },
      { name: 'Garlic', quantity: '3 cloves' }
    ],
    instructions: [
      'Season chicken with salt and pepper',
      'Heat olive oil in a pan',
      'Cook chicken for 6-7 minutes per side',
      'Sauté vegetables until tender',
      'Serve over rice with vegetables'
    ],
    cookingTime: 25
  },
  {
    id: '2',
    name: 'Vegetarian Stir Fry',
    image: 'vegetarian stir fry',
    cuisine: 'Asian',
    isVegetarian: true,
    calories: 320,
    proteins: 12,
    carbs: 45,
    ingredients: [
      { name: 'Bell peppers', quantity: '2 cups' },
      { name: 'Onions', quantity: '1 large' },
      { name: 'Garlic', quantity: '4 cloves' },
      { name: 'Rice', quantity: '1 cup' },
      { name: 'Soy sauce', quantity: '3 tbsp' }
    ],
    instructions: [
      'Cook rice according to package instructions',
      'Heat oil in wok or large pan',
      'Stir fry vegetables for 5-7 minutes',
      'Add soy sauce and seasonings',
      'Serve over rice'
    ],
    cookingTime: 20
  },
  {
    id: '3',
    name: 'Garlic Herb Chicken',
    image: 'garlic herb chicken',
    cuisine: 'Italian',
    isVegetarian: false,
    calories: 380,
    proteins: 32,
    carbs: 15,
    ingredients: [
      { name: 'Chicken breast', quantity: '250g' },
      { name: 'Garlic', quantity: '5 cloves' },
      { name: 'Olive oil', quantity: '3 tbsp' },
      { name: 'Tomatoes', quantity: '3 medium' },
      { name: 'Herbs', quantity: '2 tsp' }
    ],
    instructions: [
      'Marinate chicken with herbs and garlic',
      'Heat olive oil in skillet',
      'Cook chicken until golden brown',
      'Add tomatoes and simmer',
      'Serve with vegetables'
    ],
    cookingTime: 30
  },

  // New Vegetarian Indian Dishes
  {
    id: '4',
    name: 'Mixed Vegetable Curry',
    image: 'mixed vegetable curry indian',
    cuisine: 'Indian',
    isVegetarian: true,
    calories: 280,
    proteins: 8,
    carbs: 42,
    ingredients: [
      { name: 'Potatoes', quantity: '2 medium' },
      { name: 'Carrots', quantity: '1 cup' },
      { name: 'Peas', quantity: '1/2 cup' },
      { name: 'Cauliflower', quantity: '1 cup' },
      { name: 'Green beans', quantity: '1/2 cup' },
      { name: 'Onions', quantity: '1 large' },
      { name: 'Tomatoes', quantity: '2 medium' },
      { name: 'Ginger', quantity: '1 inch' },
      { name: 'Garlic', quantity: '4 cloves' },
      { name: 'Coriander powder', quantity: '1 tsp' },
      { name: 'Turmeric', quantity: '1/2 tsp' },
      { name: 'Chili powder', quantity: '1 tsp' },
      { name: 'Oil', quantity: '2 tbsp' }
    ],
    instructions: [
      'Chop all vegetables evenly',
      'In oil, sauté onions, garlic, and ginger until golden',
      'Add chopped tomatoes and cook till soft',
      'Add spices (turmeric, coriander, chili powder, salt)',
      'Add all veggies and mix well',
      'Add water, cover, and simmer for 15–20 mins till veggies are soft',
      'Garnish with coriander leaves'
    ],
    cookingTime: 35
  },
  {
    id: '5',
    name: 'Aloo Gobi (Potato & Cauliflower Stir Fry)',
    image: 'aloo gobi indian potato cauliflower',
    cuisine: 'Indian',
    isVegetarian: true,
    calories: 250,
    proteins: 6,
    carbs: 38,
    ingredients: [
      { name: 'Cauliflower', quantity: '2 cups' },
      { name: 'Potatoes', quantity: '2 medium' },
      { name: 'Onions', quantity: '1 medium' },
      { name: 'Tomatoes', quantity: '1 medium' },
      { name: 'Turmeric', quantity: '1/2 tsp' },
      { name: 'Chili powder', quantity: '1 tsp' },
      { name: 'Cumin seeds', quantity: '1 tsp' },
      { name: 'Ginger', quantity: '1 inch' },
      { name: 'Garlic', quantity: '3 cloves' },
      { name: 'Oil', quantity: '2 tbsp' }
    ],
    instructions: [
      'Heat oil, add cumin seeds, then onions',
      'Sauté onions, then add ginger-garlic and chopped tomatoes',
      'Add turmeric, chili powder, salt',
      'Add cauliflower and potato pieces',
      'Cover and cook on low flame till soft, stirring occasionally',
      'Garnish with coriander'
    ],
    cookingTime: 30
  },
  {
    id: '6',
    name: 'Palak Paneer (Spinach & Cottage Cheese)',
    image: 'palak paneer indian spinach',
    cuisine: 'Indian',
    isVegetarian: true,
    calories: 320,
    proteins: 18,
    carbs: 12,
    ingredients: [
      { name: 'Spinach', quantity: '2 bunches' },
      { name: 'Paneer (cottage cheese)', quantity: '200g' },
      { name: 'Onion', quantity: '1 medium' },
      { name: 'Tomato', quantity: '1 medium' },
      { name: 'Garlic', quantity: '4 cloves' },
      { name: 'Ginger', quantity: '1 inch' },
      { name: 'Green chili', quantity: '1' },
      { name: 'Oil', quantity: '2 tbsp' },
      { name: 'Turmeric', quantity: '1/2 tsp' },
      { name: 'Cream (optional)', quantity: '2 tbsp' }
    ],
    instructions: [
      'Blanch spinach leaves in hot water, then blend to a puree',
      'Sauté onions, garlic, ginger in oil',
      'Add chopped tomatoes and green chili; cook till soft',
      'Add spinach puree, salt, turmeric; cook 5–6 mins',
      'Add paneer cubes; simmer 5 more minutes',
      'Optional: Add cream for richness'
    ],
    cookingTime: 25
  },

  // New Non-Vegetarian Indian Dishes
  {
    id: '7',
    name: 'Egg Bhurji (Indian Scrambled Eggs)',
    image: 'egg bhurji indian scrambled eggs',
    cuisine: 'Indian',
    isVegetarian: false,
    calories: 290,
    proteins: 22,
    carbs: 8,
    ingredients: [
      { name: 'Eggs', quantity: '4 large' },
      { name: 'Onions', quantity: '1 medium' },
      { name: 'Tomatoes', quantity: '1 medium' },
      { name: 'Green chilies', quantity: '2' },
      { name: 'Turmeric', quantity: '1/2 tsp' },
      { name: 'Chili powder', quantity: '1/2 tsp' },
      { name: 'Oil', quantity: '2 tbsp' }
    ],
    instructions: [
      'Heat oil, sauté onions and green chilies',
      'Add tomatoes and cook till soft',
      'Add turmeric, chili powder, and salt',
      'Crack eggs into the pan, scramble and cook till done',
      'Serve hot with roti or bread'
    ],
    cookingTime: 15
  },
  {
    id: '8',
    name: 'Chicken Biryani (Simple One-Pot)',
    image: 'chicken biryani indian rice',
    cuisine: 'Indian',
    isVegetarian: false,
    calories: 520,
    proteins: 35,
    carbs: 48,
    ingredients: [
      { name: 'Chicken', quantity: '500g' },
      { name: 'Basmati rice', quantity: '2 cups' },
      { name: 'Onions', quantity: '2 large' },
      { name: 'Yogurt', quantity: '1/2 cup' },
      { name: 'Ginger-garlic paste', quantity: '2 tbsp' },
      { name: 'Biryani masala', quantity: '2 tsp' },
      { name: 'Mint leaves', quantity: '1/4 cup' },
      { name: 'Coriander leaves', quantity: '1/4 cup' },
      { name: 'Oil', quantity: '3 tbsp' }
    ],
    instructions: [
      'Marinate chicken in yogurt, spices, and ginger-garlic paste',
      'Fry onions till golden. Add chicken and cook 10 mins',
      'Layer half-cooked rice over chicken, top with mint and coriander',
      'Cook on low (dum) for 20–25 mins',
      'Fluff and serve'
    ],
    cookingTime: 60
  },
  {
    id: '9',
    name: 'Egg Curry',
    image: 'real-egg-curry', // Special marker for the real image
    cuisine: 'Indian',
    isVegetarian: false,
    calories: 340,
    proteins: 20,
    carbs: 15,
    ingredients: [
      { name: 'Boiled eggs', quantity: '6' },
      { name: 'Onions', quantity: '2 medium' },
      { name: 'Tomatoes', quantity: '2 medium' },
      { name: 'Garlic', quantity: '4 cloves' },
      { name: 'Ginger', quantity: '1 inch' },
      { name: 'Turmeric', quantity: '1/2 tsp' },
      { name: 'Chili powder', quantity: '1 tsp' },
      { name: 'Garam masala', quantity: '1/2 tsp' },
      { name: 'Oil', quantity: '2 tbsp' }
    ],
    instructions: [
      'Boil and peel eggs',
      'Sauté onions, garlic, ginger, and tomatoes',
      'Add spices and cook into a thick gravy',
      'Add eggs, simmer for 5–10 mins',
      'Garnish and serve with rice or roti'
    ],
    cookingTime: 25
  },
  {
    id: '10',
    name: 'Spicy Chicken Fry',
    image: 'spicy chicken fry indian',
    cuisine: 'Indian',
    isVegetarian: false,
    calories: 380,
    proteins: 42,
    carbs: 5,
    ingredients: [
      { name: 'Boneless chicken', quantity: '500g' },
      { name: 'Garlic', quantity: '6 cloves' },
      { name: 'Ginger', quantity: '2 inch' },
      { name: 'Chili powder', quantity: '2 tsp' },
      { name: 'Black pepper', quantity: '1 tsp' },
      { name: 'Curry leaves', quantity: '10-12' },
      { name: 'Oil', quantity: '3 tbsp' }
    ],
    instructions: [
      'Marinate chicken in spices, ginger-garlic paste',
      'Heat oil, fry curry leaves and add chicken',
      'Cook on high heat until crispy and fully cooked',
      'Serve hot as a starter or side dish'
    ],
    cookingTime: 20
  }
];

export function RecipeSuggestions({ 
  groceries, 
  filters, 
  onFiltersChange, 
  onRecipeSelect, 
  favorites, 
  onToggleFavorite,
  onNavigate 
}: RecipeSuggestionsProps) {
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecipes = mockRecipes.filter(recipe => {
    if (filters.cuisine !== 'all' && recipe.cuisine !== filters.cuisine) {
      return false;
    }
    if (filters.isVegetarian && !recipe.isVegetarian) {
      return false;
    }
    if (recipe.calories < filters.calorieRange[0] || recipe.calories > filters.calorieRange[1]) {
      return false;
    }
    return true;
  });

  // Function to get the correct image source
  const getImageSrc = (recipe: Recipe): string => {
    if (recipe.image === 'real-egg-curry') {
      // If eggCurryImage is a StaticImageData, use its src property
      // Otherwise, if it's already a string, return as is
      return typeof eggCurryImage === 'string' ? eggCurryImage : eggCurryImage.src;
    }
    return `https://images.unsplash.com/400x300/?${recipe.image}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-1"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
            <h1 className="text-xl" style={{ color: '#4CAF50' }}>Recipe Suggestions</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1"
          >
            <Filter size={16} />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Groceries Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🛒 Your Groceries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {groceries.map((item, index) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Cuisine Type</Label>
                  <Select 
                    value={filters.cuisine} 
                    onValueChange={(value) => onFiltersChange({ ...filters, cuisine: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cuisines</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="Asian">Asian</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="vegetarian"
                    checked={filters.isVegetarian}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, isVegetarian: checked })}
                  />
                  <Label htmlFor="vegetarian">Vegetarian Only</Label>
                </div>

                <div>
                  <Label>Calorie Range: {filters.calorieRange[0]} - {filters.calorieRange[1]}</Label>
                  <Slider
                    value={filters.calorieRange}
                    onValueChange={(value) => onFiltersChange({ ...filters, calorieRange: value })}
                    max={600}
                    min={200}
                    step={50}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2>Found {filteredRecipes.length} recipes for you</h2>
          <p className="text-sm text-muted-foreground">
            Sorted by ingredient match and nutritional value
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="cursor-pointer hover:shadow-lg transition-all">
              <div className="relative">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={getImageSrc(recipe)}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full"
                  style={{ color: favorites.includes(recipe.id) ? '#FF4C4C' : '#666' }}
                >
                  <Heart size={16} fill={favorites.includes(recipe.id) ? '#FF4C4C' : 'none'} />
                </button>
                
                <div className="absolute top-3 left-3 flex space-x-2">
                  <Badge 
                    className="text-xs"
                    style={{ 
                      backgroundColor: recipe.isVegetarian ? '#4CAF50' : '#FF4C4C',
                      color: 'white'
                    }}
                  >
                    {recipe.isVegetarian ? 'Veg' : 'Non-Veg'}
                  </Badge>
                  {recipe.cuisine === 'Indian' && (
                    <Badge 
                      className="text-xs"
                      style={{ backgroundColor: '#8E24AA', color: 'white' }}
                    >
                      🇮🇳 Indian
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4" onClick={() => onRecipeSelect(recipe)}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium line-clamp-2">{recipe.name}</h3>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <span>{recipe.cuisine}</span>
                  <span className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{recipe.cookingTime}m</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ backgroundColor: '#FFC107', color: 'white' }}
                    >
                      🔥 {recipe.calories} cal
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {recipe.proteins}g protein
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No recipes found matching your filters</p>
            <Button 
              onClick={() => onFiltersChange({ cuisine: 'all', isVegetarian: false, calorieRange: [200, 600] })}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}