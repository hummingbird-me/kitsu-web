import Ember from 'ember';
import Application from 'ember-application';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
