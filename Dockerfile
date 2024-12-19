FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get -y upgrade && apt-get install -y sudo && apt install -y software-properties-common && apt-get install -y wget && apt-get install -y git && apt install nano

# Install php
#RUN apt-get update && add-apt-repository -y ppa:ondrej/php && apt-get update && apt-get install -y php8.1-fpm && sudo apt install -y php8.1-common php8.1-mysql php8.1-xml php8.1-xmlrpc php8.1-curl php8.1-gd php8.1-imagick php8.1-cli php8.1-dev php8.1-imap php8.1-mbstring php8.1-opcache php8.1-soap php8.1-zip php8.1-redis php8.1-intl --fix-missing

# Install nginx
RUN sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring &&\
    curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null &&\
    echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
    http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list && \
    apt-get update && apt-get install -y nginx

RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
RUN sudo bash /tmp/nodesource_setup.sh
RUN sudo apt -y install nodejs
RUN sudo apt install wget ca-certificates

RUN sudo apt-get update --fix-missing

#Below are my commands
WORKDIR /var/www/html
COPY . .

CMD service nginx start
RUN cp /var/www/html/default.conf /etc/nginx/conf.d
CMD service nginx stop
CMD service nginx start

RUN npm install pm2@latest -g

RUN cd /
RUN mkdir /news-portal
RUN cp -r /var/www/html/* /news-portal/
RUN cd /news-portal/app
RUN npm --prefix /news-portal/app install

RUN ["chmod", "+x", "./start.sh"]

ENTRYPOINT ["./start.sh"]