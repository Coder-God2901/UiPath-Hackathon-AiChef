# grocery-bill-ai\process_bill.py

import os
import sys
import json
from app.services.ocr_service import extract_text_from_bill
from app.services.model import analyze_bill

def process_bill_file(filepath):
    """
    Processes a bill image to extract and analyze groceries.
    """
    try:
        # Step 1: Extract text from the bill as a single string
        text = extract_text_from_bill(filepath)

        # Step 2: Split the text into lines to pass to the model
        text_lines = text.split("\n")

        # Step 3: Run AI model analysis directly on the raw text lines
        # The 'analyze_bill' function now handles parsing
        result = analyze_bill(text_lines)
        
        # We only return the final structured result
        return json.dumps({
            "items": result
        })

    except Exception as e:
        return json.dumps({
            "error": str(e)
        })

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        output_json = process_bill_file(file_path)
        # We write the JSON directly to stdout to avoid extra characters
        sys.stdout.write(output_json)
        sys.stdout.flush()
    else:
        sys.stdout.write(json.dumps({"error": "No file path provided."}))
        sys.stdout.flush()