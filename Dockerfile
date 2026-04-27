FROM nginx:stable-alpine

RUN mkdir -p /data/www/web/html
ENV TZ=Asia/Shanghai
RUN apk add --update tzdata \
    && ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone             

ADD dist /data/www/web/html/

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;"]
