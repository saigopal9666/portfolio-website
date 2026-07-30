import os
import urllib.request
import json
import sys

def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: API key not found in environment!")
        return

    print("Checking which models your API Key has access to...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    req = urllib.request.Request(url)
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            models = data.get('models', [])
            valid_models = []
            
            for m in models:
                methods = m.get('supportedGenerationMethods', [])
                if 'generateContent' in methods:
                    valid_models.append(m['name'])
            
            if valid_models:
                print("\nSUCCESS! Your key has access to these models:")
                for vm in valid_models:
                    print(f" - {vm}")
                print("\nPlease copy the list above and send it to me!")
            else:
                print("\nWARNING: Your key doesn't have generateContent access to any models!")
                
    except urllib.error.HTTPError as e:
        print(f"\nHTTP Error {e.code}: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"\nError: {str(e)}")

if __name__ == "__main__":
    main()
