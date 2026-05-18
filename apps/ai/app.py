from fastapi import FastAPI

app = FastAPI()

@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'ai'}

@app.post('/moderate')
def moderate(text: str):
    blocked_words = ['bad', 'violence', 'hate']
    normalized = text.lower()
    is_clean = not any(word in normalized for word in blocked_words)
    return {'clean': is_clean, 'text': text}

@app.post('/suggest')
def suggest(level_json: dict):
    return {
        'suggestions': [
            'Legg til en plattform til for å forlenge banen.',
            'Flytt et hinder nærmere starten for mer utfordring.'
        ],
        'level': level_json
    }
