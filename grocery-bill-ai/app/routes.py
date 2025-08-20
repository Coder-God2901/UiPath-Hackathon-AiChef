import os
import pandas as pd
from flask import Blueprint, render_template, request, send_file
from .services.ocr_service import extract_text_from_bill
from .services.parser import parse_bill_text
from .services.model import analyze_bill

main_bp = Blueprint("main", __name__)
OUTPUT_DIR = "data/outputs"

@main_bp.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files["bill"]
        if file:
            filepath = os.path.join("data/sample_bills", file.filename)
            file.save(filepath)

            # Step 1: Extract text
            text = extract_text_from_bill(filepath)

            # Step 2: Parse bill into structured items
            items = parse_bill_text(text)

            # Step 3: Run AI model analysis
            result = analyze_bill(items)

            # Save outputs
            df = pd.DataFrame(result)
            base_name = os.path.splitext(file.filename)[0]
            csv_path = os.path.join(OUTPUT_DIR, f"{base_name}_analysis.csv")
            json_path = os.path.join(OUTPUT_DIR, f"{base_name}_analysis.json")
            df.to_csv(csv_path, index=False)
            df.to_json(json_path, orient="records", indent=2)

            return render_template(
                "result.html", 
                items=items, 
                result=result, 
                csv_file=f"{base_name}_analysis.csv",
                json_file=f"{base_name}_analysis.json"
            )

    return render_template("index.html")

@main_bp.route("/download/<filetype>/<filename>")
def download_file(filetype, filename):
    path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return "File not found", 404
