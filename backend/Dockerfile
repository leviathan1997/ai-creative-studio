# Python için resmi bir temel görüntü kullanın
FROM python:3.12-slim

# Çalışma dizinini ayarlayın
WORKDIR /app

# Bağımlılıkları kopyalayın ve yükleyin
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyalayın
COPY . .

# Ortam değişkenini ayarlayın (Cloud Run'da ayarlanacak)
# ENV GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Uvicorn'u başlatmak için komutu tanımlayın
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
