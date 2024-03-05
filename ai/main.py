from flask import Flask, request, jsonify
import base64
import io
from PIL import Image
import numpy as np
from geoguesser import GeoGuesser
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
agent = GeoGuesser('/Dataset/train', '/Dataset/valid', 6)

@app.route('/geoguesser-guess', methods=['POST'])
def guess():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    image_data = data['image']
    try:
        decoded_image = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(decoded_image))
        img_array = agent.preprocess_image(image)

        predicted_class_index = agent.predict_location('./geoguesser_65.keras', img_array)
        predicted_location = GeoGuesser.categories[predicted_class_index]

        return jsonify({'location': predicted_location})
    except Exception as e:
        app.logger.error(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, threaded=True)