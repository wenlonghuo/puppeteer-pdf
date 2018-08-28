FROM alekzonder/puppeteer:1

# COPY package.json /app/package.json
COPY . /app

USER root
RUN apt-get update && apt-get install -y pdftk \
  && rm -rf ./node_modules/ \
  && npm install --production \
  && chmod -R 755 /app/static

USER pptruser
# Default to port 80 for node, and 5858 or 9229 for debug
ARG PORT=19898
ENV PORT $PORT
EXPOSE $PORT 5858 9229

CMD ["node", "app/index.js"]
