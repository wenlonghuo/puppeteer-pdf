FROM wenlonghuo/puppeteer-pdf-base:1.0.0

# COPY package.json /app/package.json
COPY . /app

USER root

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="TRUE"

RUN rm -rf ./node_modules/ && rm -rf ./example/node_modules/ \
  && npm install --production && npm cache clean --force

USER pptruser
# Default to port 80 for node, and 5858 or 9229 for debug
ARG PORT=19898
ENV PORT $PORT
EXPOSE $PORT 5858 9229

CMD ["node", "app/index.js"]
