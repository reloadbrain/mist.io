FROM gcr.io/mist-ops/alpine:3.4
MAINTAINER mist.io <support@mist.io>

ENV PYTHONDONTWRITEBYTECODE True

RUN apk add --update --no-cache libvirt libvirt-dev

RUN pip install libvirt-python==2.4.0

ADD container/uwsgi.ini /uwsgi.ini

ADD container/packet.net.crt /usr/local/share/ca-certificates/packet.net.crt

RUN mkdir -p /etc/ssl/certs/ && update-ca-certificates --fresh && \
    rm -rf /var/cache/apk/*

ADD requirements.txt /requirements.txt

RUN pip install -r /requirements.txt && rm /requirements.txt

ADD . /mist.io

WORKDIR /mist.io

RUN pip install -e /mist.io/src/libcloud && \
    pip install -e /mist.io
