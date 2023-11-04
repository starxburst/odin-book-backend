FROM node:lts-alpine
ENV NODE_ENV=production
# Define environment variables
ENV MONGODB_URI=mongodb+srv://starburst:159753@cluster0.7mxly.mongodb.net/
ENV TOKEN_SECRET=159753
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
