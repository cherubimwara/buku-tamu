# Gunakan image Nginx sebagai web server
FROM nginx:alpine

# Hapus konfigurasi default nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin file HTML dan JS ke dalam direktori html nginx
COPY index.html /usr/share/nginx/html/
COPY calc.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]