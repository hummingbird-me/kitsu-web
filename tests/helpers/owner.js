import Ember from 'ember';

// eslint-disable-next-line
let Owner;

if (Ember._RegistryProxyMixin && Ember._ContainerProxyMixin) {
  Owner = Ember.Object.extend(Ember._RegistryProxyMixin, Ember._ContainerProxyMixin);
} else {
  Owner = Ember.Object.extend();
}

export default Owner;
