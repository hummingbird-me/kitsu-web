FROM node:6.9.1
MAINTAINER Kitsu, Inc.

RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 0.18.1
ENV PATH="/root/.yarn/bin:${PATH}"
RUN yarn global add bower
RUN mkdir -p /opt/kitsu/client

# Preinstall dependencies in an earlier layer so we don't reinstall every time
# any file changes.
COPY ./package.json /opt/kitsu/client/
COPY ./bower.json /opt/kitsu/client/
COPY ./yarn.lock /opt/kitsu/client/
WORKDIR /opt/kitsu/client
RUN yarn install --pure-lockfile
RUN bower install --allow-root -q

# *NOW* we copy the codebase in
COPY . /opt/kitsu/client

ENTRYPOINT ["./node_modules/.bin/ember"]
CMD ["serve", "--port=80", "--environment=development", "--live-reload-port=57777"]
EXPOSE 57777
EXPOSE 80
