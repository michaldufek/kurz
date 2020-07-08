Running locally (it will use https://dev.analyticalplatform.com for API calls):
npm install
npm run dev

Running in docker (https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html):
- api url for production will be from localhost (for development it will be https://dev.analyticalplatform.com)
- if backend is not running locally (and running in production) in src/custom/assets/js/constants.js comment second and uncomment third line
- build & run docker container (it will run on your localhost on 8080 and 80 is port exposed in docker - see EXPOSE 80 in Dockerfile):
docker build -t vuejs-cookbook/dockerize-vuejs-app .
docker run -it -p 8080:80 --rm --name dockerize-vuejs-app-1 vuejs-cookbook/dockerize-vuejs-app