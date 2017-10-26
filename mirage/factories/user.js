import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  about() { return faker.lorem.paragraph(); },
  avatar() { return faker.internet.avatar(); },
  email() { return faker.internet.email(); },
  followersCount() { return faker.random.number(100); },
  followingCount() { return faker.random.number(100); },
  location() { return faker.address.country(); },
  password() { return faker.internet.password(); },
  pastNames: [],
  name() { return faker.internet.userName(); },
  slug() { return faker.internet.userName(); },
  waifuOrHusbando() { return faker.list.random('Waifu', 'Husbando')(); }
});
