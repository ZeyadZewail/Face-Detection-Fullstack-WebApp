FROM node:lts
RUN apt-get -y update
RUN apt-get -y install git
#RUN apt -y install nodejs
EXPOSE 8080

WORKDIR /root
RUN git clone https://github.com/ZeyadZewail/Face-Detection-Fullstack-WebApp

WORKDIR /root/Face-Detection-Fullstack-WebApp/Face-Recognition-reactTS
RUN npm install
RUN npm run build


WORKDIR /root/Face-Detection-Fullstack-WebApp/Face-Recognition-Server-TS
RUN npm install
RUN npm run build
CMD npm start
