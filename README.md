FRS applications

Running in docker (https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html):
docker build -t vuejs-cookbook/dockerize-vuejs-app .
docker run -it -p 8080:80 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app
(it will run on your localhost on 8080 and 80 is port exposed in docker - see EXPOSE 80 in Dockerfile)