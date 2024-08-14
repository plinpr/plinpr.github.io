
from flask import Flask, request, jsonify, render_template
from PIL import Image
import numpy as np
from collections import defaultdict

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    # RGB 색상 코드 입력 받기
    rgb_codes = request.form.getlist('rgb_codes')
    rgb_codes = [tuple(map(int, code.split(','))) for code in rgb_codes]
    
    # 색상 코드와 이름 매핑 (여기서 'color_mapping'을 사용)
    color_mapping = {code: f'Color_{i}' for i, code in enumerate(rgb_codes)}
    
    # 색상 명칭별 픽셀 수를 저장할 딕셔너리
    color_counts = defaultdict(int)
    
    # 이미지 파일 업로드 받기
    image_file = request.files['image']
    image = Image.open(image_file).convert('RGB')
    width, height = image.size
    pixels = image.load()

    # 색상 명칭별 픽셀 수 계산
    for x in range(width):
        for y in range(height):
            color = pixels[x, y]
            if color in color_mapping:
                color_name = color_mapping[color]
                color_counts[color_name] += 1

    # 각 열의 색상 코드의 픽셀 수 계산
    column_color_count = []
    for col in range(width):
        col_count = defaultdict(int)
        for row in range(height):
            color = pixels[col, row]
            if color in color_mapping:
                color_name = color_mapping[color]
                col_count[color_name] += 1
        column_color_count.append(col_count)

    return jsonify({
        'color_count': dict(color_counts),
        'column_color_count': column_color_count
    })

if __name__ == '__main__':
    app.run(debug=True)
