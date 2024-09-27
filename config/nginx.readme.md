# Nginx 优化配置

## 1. 启用 Gzip 压缩：

   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   gzip_comp_level 6;
   gzip_min_length 1000;
   ```

这可以显著减少传输的数据量，加快加载速度。

## 2. 添加安全头：

   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-XSS-Protection "1; mode=block";
   add_header X-Content-Type-Options "nosniff";
   ```

这些头部可以提高网站的安全性。

## 3. 优化 SSL/TLS（如果使用 HTTPS）：

   ```nginx
   ssl_protocols TLSv1.2 TLSv1.3;
   ssl_prefer_server_ciphers on;
   ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
   ```

## 4. 配置浏览器缓存：

   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires max;
       add_header Cache-Control "public, max-age=31536000, immutable";
   }
   ```

对于不经常变化的静态资源，可以设置更长的缓存时间。

## 5. 启用 HTTP/2：

   ```nginx
   listen 443 ssl http2;
   ```

如果使用 HTTPS，启用 HTTP/2 可以提高性能。

## 6. 配置 CORS（如果需要）：

   ```nginx
   add_header 'Access-Control-Allow-Origin' '*';
   add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
   ```

## 7. 优化日志：

   ```nginx
   access_log off;
   error_log /var/log/nginx/error.log crit;
   ```

关闭访问日志并只记录严重错误可以提高性能。

## 8. 添加 Brotli 压缩（如果您的 Nginx 支持）：

   ```nginx
   brotli on;
   brotli_comp_level 6;
   brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   ```

Brotli 通常比 Gzip 提供更好的压缩率。

## 9. 配置 FastCGI 缓存（如果使用后端服务）：

   ```nginx
   fastcgi_cache_path /tmp/nginx_cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;
   ```

这些优化可以进一步提高性能、安全性和用户体验。具体实施时，请根据您的实际需求和环境进行调整。

您想深入了解其中的某个优化点吗？或者您有其他特定的性能考虑需要讨论？
