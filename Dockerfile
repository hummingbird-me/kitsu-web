FROM node:19-alpine

RUN mkdir -p /opt/kitsu/client

# Preinstall dependencies in an earlier layer so we don't reinstall every time
# any file changes.
COPY ./package.json /opt/kitsu/client/
COPY ./package-lock.json /opt/kitsu/client/
WORKDIR /opt/kitsu/client
RUN npm ci

# *NOW* we copy the codebase in
COPY . /opt/kitsu/client

ENTRYPOINT ["npm", "run"]
CMD ["dev", "--port=80", "--strictPort"]
EXPOSE 80
