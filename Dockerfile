# Node 12 requires several dependeny updates 
# (some child dependency versions don't have 12 in their package.json "engines")
FROM node:13
MAINTAINER Kitsu, Inc.

RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.0
ENV PATH="/root/.yarn/bin:${PATH}"
RUN mkdir -p /opt/kitsu/client

# Preinstall dependencies in an earlier layer so we don't reinstall every time
# any file changes.
COPY ./package.json /opt/kitsu/client/
COPY ./yarn.lock /opt/kitsu/client/
WORKDIR /opt/kitsu/client
RUN yarn install --pure-lockfile

# *NOW* we copy the codebase in
COPY . /opt/kitsu/client

ENTRYPOINT ["./node_modules/.bin/ember"]
CMD ["serve", "--port=80", "--environment=development", "--live-reload-port=57777"]
EXPOSE 57777
EXPOSE 80
