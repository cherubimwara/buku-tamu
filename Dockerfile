# Gunakan base image
FROM node:20-alpine

# Buat direktori kerja
WORKDIR /app

# Salin semua file ke dalam container
COPY . .

# Install http-server
RUN npm install -g http-server

# Expose port default
EXPOSE 8080

# Jalankan server
CMD ["http-server", ".", "-p", "8080"]
