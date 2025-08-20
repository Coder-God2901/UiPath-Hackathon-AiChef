import re

def parse_bill_text(text):
    items = []
    lines = text.split("\n")
    
    # Updated regex to look for text followed by a floating-point number with a decimal
    item_pattern = re.compile(r"^(.*?)\s+([0-9]+\.[0-9]{2})$")
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        match = item_pattern.search(line)
        if match:
            # Check for common non-grocery keywords
            if not any(keyword in line.upper() for keyword in ["TOTAL", "SUBTOTAL", "TAX", "TEND", "CHANGE", "ID", "REF", "CODE"]):
                item_name = match.group(1).strip()
                item_price = float(match.group(2))
                items.append({"name": item_name, "price": item_price})
    
    return items