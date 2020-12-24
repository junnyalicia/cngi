FROM python:3.8-slim-buster

WORKDIR /app
COPY requirements.txt start_production.sh /app/
EXPOSE 80
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list \
 && sed -i 's/security.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list \
 && sed -i 's/http:/https:/' /etc/apt/sources.list \
 && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
 && apt update \
 && pip config set global.index-url https://mirrors.nwafu.edu.cn/pypi/ \
 && pip install --no-cache-dir -U pip gunicorn \
 && pip install --no-cache-dir -r /app/requirements.txt \
 && rm /app/requirements.txt \
 && chmod -R 777 /run /root \
 && chmod a+x /app/start_production.sh

CMD "/app/start_production.sh"
