# AiChef/grocery-bill-ai/app/services/model.py

import google.generativeai as genai
import json

# Configure the Gemini API with your key.
# Replace with your actual key and consider using environment variables.
genai.configure(api_key="AIzaSyBKJI-zDAclSVon5ywR_U7hkGeFUNrSJhw")

def analyze_bill(items):
    """
    Analyzes raw text using the Gemini API to extract ingredients and quantities.
    """
    # Join the items into a single string for better context
    raw_text = "\n".join(items)

    # Craft a clear and specific prompt for the Gemini API
    prompt = f"""
    You are an expert at analyzing grocery store receipts. Your task is to extract only the food items, ingredients, and their quantities from the following text. Ignore all other information like store details, transaction numbers, dates, taxes, and totals.

    List the items in a JSON format. Each object in the list should have 'item_name' and 'quantity'. If the quantity is not specified, assume 1. The quantity should be a number.

    Example format:
    [
      {{"item_name": "Large Eggs", "quantity": 12}},
      {{"item_name": "Milk", "quantity": 1}},
      {{"item_name": "Chicken Breast", "quantity": 2}}
    ]

    Raw receipt text:
    ---
    {raw_text}
    ---
    """

    # Call the Gemini API to generate content
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)

        # Ensure the response has content
        if not response.text:
            print("Gemini API response was empty.")
            return []

        # Use regular expressions to extract only the JSON part from the response.
        import re
        json_match = re.search(r'\[.*\]', response.text, re.DOTALL)
        
        if json_match:
            json_string = json_match.group(0)
            parsed_items = json.loads(json_string)
            return parsed_items
        else:
            print("No JSON array found in the Gemini response.")
            print(f"Raw Gemini response: {response.text}")
            return []

    except json.JSONDecodeError as e:
        print(f"Error parsing Gemini response: {e}")
        print(f"Raw Gemini response: {response.text}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []