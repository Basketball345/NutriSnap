from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from dotenv import load_dotenv
import os 

import base64

import requests

import time

load_dotenv()
Foodvisor_key = os.environ.get("FOODVISOR_API")
Azure_key = os.environ.get("AZURE_API")
Read_url = os.environ.get("READ_AZURE_URL")
Results_url = os.environ.get("ANALYZE_AZURE_URL")

#Set up REST API
app = Flask(__name__)
api = Api(app)
CORS(app)

def extract_nutritional_info(nutrition, quantity):
    return {
        "calories": (nutrition.get("calories_100g", 0.0) * quantity) / 100,
        "protein": (nutrition.get("proteins_100g", 0.0) * quantity) / 100,
        "fat": (nutrition.get("fat_100g", 0.0) * quantity) / 100,
        "sugar": (nutrition.get("sugars_100g", 0.0) * quantity) / 100,
        "fiber": (nutrition.get("fibers_100g", 0.0) * quantity) / 100,
        "carbs": (nutrition.get("carbs_100g", 0.0) * quantity) / 100
    }

def parse_response(data):
    food_items = []
    nutrition_summary = {
        "calories": 0.0,
        "protein": 0.0,
        "fat": 0.0,
        "sugar": 0.0,
        "fiber": 0.0,
        "carbs": 0.0
    }

    items = data.get("items", [])
    
    for item in items:
        first_food = item.get("food", [])[0] if item.get("food") else None
        if first_food is not None:
            display_name = first_food['food_info']['display_name']
            food_items.append(display_name)
            quantity = first_food.get('quantity', 0.0)  # Get the quantity

            nutrition = first_food['food_info'].get('nutrition', {})
            
            # Adding the calculated nutrition info to summaries
            nutrition_info = extract_nutritional_info(nutrition, quantity)
            for key in nutrition_summary:
                nutrition_summary[key] += nutrition_info[key]

    return food_items, nutrition_summary

class send_Image(Resource):
    def post(self):
        #Request json object - content-type "application/json". This line parses through it and returns a python dictionary
        data = request.get_json()
        base64_str = data["Base64"]
        image = base64.b64decode(base64_str)

        if(data["Type"] == "Foodvisor"):
            url = "https://vision.foodvisor.io/api/1.0/en/analysis/"
            headers = {"Authorization": f"Api-Key {Foodvisor_key}"}

            response = requests.post(url, headers=headers, files={"image": image})
            #response.raise_for_status()
            
            response_data = response.json()

            food_items, nutrition_summary = parse_response(response_data)
            print("Food Items:", food_items)
            print("Nutrition Summary:")
            for nutrient, value in nutrition_summary.items():
                print(f"  {nutrient.capitalize()}: {value}")

            result = {
                "nutrition_summary": nutrition_summary,
                "food_items": food_items
            }
    
            # Return JSON response
            return jsonify(result)

        
        else:

            def extract_nutrient_value(text, keyword):
                # Find the keyword in the text
                keyword_index = text.find(keyword)
                if keyword_index == -1:
                    return None
                
                # Find the first number following the keyword
                text_after_keyword = text[keyword_index + len(keyword):]
                value = ""
                for char in text_after_keyword:
                    if char.isdigit() or char == '.':
                        value += char
                    elif value: # Stop when a complete number is formed
                        break
                        
                if not value:
                    return None

                value = float(value)

                # Check the unit
                if keyword in ["calories"]:
                    return value
                else:
                    if "mg" in text_after_keyword:
                        return value / 1000
                    else:
                        return value
        
            def process_response(response_data):
                nutrients = {
                    "Calories": 0.0,
                    "Protein": 0.0,
                    "Sugar": 0.0,
                    "Carbs": 0.0,
                    "Fiber": 0.0,
                    "Total Fat": 0.0
                }

                # Traverse the JSON response
                analyze_result = response_data.get('analyzeResult', {})
                read_results = analyze_result.get('readResults', [])

                for result in read_results:
                    lines = result.get('lines', [])
                    for line in lines:
                        text = line.get('text', "")

                        for nutrient in nutrients.keys():
                            extracted_value = extract_nutrient_value(text, nutrient)
                            if extracted_value is not None:
                                nutrients[nutrient] += extracted_value

                return nutrients

            url = Read_url
            key = Azure_key
            headers = {
                "Ocp-Apim-Subscription-Key": key, 
                "Content-Type": "application/octet-stream"
            }
            response = requests.post(url, headers=headers, data=image)
            response.raise_for_status()
            operation_id = response.headers.get("Operation-Location")
    

            url = f"{Results_url}{operation_id}"
            
            headers = {
                    "Ocp-Apim-Subscription-Key": key, 
            }

            while True: 
                response = requests.get(operation_id, headers=headers)
                response.raise_for_status()
                if response.status_code == 200: 
                    response = response.json()
                    if(response["status"] == "succeeded"):
                        nutrients = process_response(response)
                        return jsonify(nutrients)
                    elif response['status'] in ('failed', 'notStarted'):
                        print(f"Error: OCR operation failed with status: {response['status']}")
                time.sleep(5)

api.add_resource(send_Image, '/upload')

if __name__ == '__main__':
    app.run(debug = True, host ='0.0.0.0', port = 5000)
