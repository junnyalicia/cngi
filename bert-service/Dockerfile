FROM python:3.7-slim

EXPOSE 5555 5556
ENV NUM_WORKER 4
ADD entrypoint.sh /
ADD chinese_L-12_H-768_A-12 /model/
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list \
 && sed -i 's/security.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list \
 && sed -i 's/http:/https:/' /etc/apt/sources.list \
 && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
 && pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/ \
 && pip install --no-cache-dir -U pip bert-serving-server tensorflow==1.15.2 \
 && chmod +x /entrypoint.sh \
 && echo

CMD /entrypoint.sh

