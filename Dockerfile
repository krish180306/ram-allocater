FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1