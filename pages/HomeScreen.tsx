// HomeScreen.tsx

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Camera, Mic, FileText, User, History, Heart } from 'lucide-react';


interface HomeScreenProps {
  onGrocerySubmit: (items: string[]) => void;
  onNavigate: (screen: 'history' | 'profile') => void;
}

interface HomeScreenProps {
  onGrocerySubmit: (items: string[]) => void;
  onNavigate: (screen: 'history' | 'profile') => void;
}

export function HomeScreen({ onGrocerySubmit, onNavigate }: HomeScreenProps) {
  const [activeInput, setActiveInput] = useState<'photo' | 'voice' | 'manual' | null>(null);
  const [manualItems, setManualItems] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceItems, setVoiceItems] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;

    const file = target.files[0];
    const formData = new FormData();
    formData.append("bill", file);

    try {
      const response = await fetch("/api/process-bill", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("API response:", data); // 👀 debug

      // const extractedItems = data.items.map((item: any) => item.item_name);
      const rawOutput = data.output;

      const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const parsedItems = JSON.parse(jsonString);

        // The actual items are in parsedOutput.items
        const extractedItems = parsedItems.map((item: any) => item.item_name);
        onGrocerySubmit(extractedItems);
      } else {
        console.error("No JSON found in backend response output.");
      }
    } catch (error) {
      console.error('API call error:', error);
    }
  };


  const handleVoiceInput = () => {
    setIsListening(true);
    // Mock voice recognition
    setTimeout(() => {
      const mockVoiceText = 'tomatoes, onions, chicken breast, rice, garlic, olive oil, bell peppers';
      setVoiceItems(mockVoiceText);
      setIsListening(false);
    }, 3000);
  };

  const handleManualSubmit = () => {
    const items = manualItems.split(',').map(item => item.trim()).filter(Boolean);
    if (items.length > 0) {
      onGrocerySubmit(items);
    }
  };

  const handleVoiceSubmit = () => {
    const items = voiceItems.split(',').map(item => item.trim()).filter(Boolean);
    if (items.length > 0) {
      onGrocerySubmit(items);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl" style={{ color: '#4CAF50' }}>🥗 Smart Recipe</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('history')}
              className="flex items-center space-x-1"
            >
              <History size={16} />
              <span>History</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-1"
            >
              <User size={16} />
              <span>Profile</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-2">What's in your kitchen today?</h2>
          <p className="text-muted-foreground">
            Tell us about your groceries and we'll suggest healthy, delicious recipes!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Photo Upload */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${activeInput === 'photo' ? 'ring-2' : ''}`}
            style={{ borderColor: activeInput === 'photo' ? '#4CAF50' : '' }}
            onClick={() => setActiveInput('photo')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: '#4CAF50' }}>
                <Camera className="text-white" size={24} />
              </div>
              <CardTitle>📸 Upload Bill or Photo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Take a picture of your grocery bill or ingredients
              </p>
              {activeInput === 'photo' && (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label htmlFor="photo-upload">
                    <Button asChild style={{ backgroundColor: '#4CAF50' }}>
                      <span>{isProcessing ? 'Processing...' : 'Choose Photo'}</span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    We'll detect items using OCR technology
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Input */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${activeInput === 'voice' ? 'ring-2' : ''}`}
            style={{ borderColor: activeInput === 'voice' ? '#4CAF50' : '' }}
            onClick={() => setActiveInput('voice')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: '#FFC107' }}>
                <Mic className="text-white" size={24} />
              </div>
              <CardTitle>🎤 Voice Command</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Speak your grocery list out loud
              </p>
              {activeInput === 'voice' && (
                <div className="space-y-3">
                  <Button
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    style={{ backgroundColor: isListening ? '#FFC107' : '#4CAF50' }}
                  >
                    {isListening ? 'Listening...' : 'Start Speaking'}
                  </Button>
                  {voiceItems && (
                    <div className="text-left p-3 bg-muted rounded">
                      <p className="text-sm">{voiceItems}</p>
                      <Button
                        onClick={handleVoiceSubmit}
                        className="mt-2 w-full"
                        style={{ backgroundColor: '#4CAF50' }}
                      >
                        Use These Items
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Say items like "tomatoes, chicken, rice..."
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry */}
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${activeInput === 'manual' ? 'ring-2' : ''}`}
            style={{ borderColor: activeInput === 'manual' ? '#4CAF50' : '' }}
            onClick={() => setActiveInput('manual')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: '#8E24AA' }}>
                <FileText className="text-white" size={24} />
              </div>
              <CardTitle>📝 Manual Entry</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Type your ingredients manually
              </p>
              {activeInput === 'manual' && (
                <div className="space-y-3">
                  <Input
                    placeholder="e.g., tomatoes, chicken, rice, onions..."
                    value={manualItems}
                    onChange={(e) => setManualItems(e.target.value)}
                    className="text-left"
                  />
                  <Button
                    onClick={handleManualSubmit}
                    disabled={!manualItems.trim()}
                    className="w-full"
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    Find Recipes
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Separate items with commas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span style={{ color: '#FFC107' }}>💡</span>
              <span>Pro Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="mb-1" style={{ color: '#4CAF50' }}>🥬 Fresh Ingredients</h4>
                <p className="text-muted-foreground">Include fresh vegetables and proteins for the best recipe suggestions</p>
              </div>
              <div>
                <h4 className="mb-1" style={{ color: '#FFC107' }}>🔥 Calorie Smart</h4>
                <p className="text-muted-foreground">We'll calculate calories based on your health profile</p>
              </div>
              <div>
                <h4 className="mb-1" style={{ color: '#8E24AA' }}>❤️ Preferences</h4>
                <p className="text-muted-foreground">Recipes will match your dietary preferences and restrictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}