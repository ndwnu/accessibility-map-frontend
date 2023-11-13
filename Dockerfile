FROM nginx:mainline-alpine

COPY dist/accessibility-map-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY startup.sh startup.sh
CMD sh startup.sh
