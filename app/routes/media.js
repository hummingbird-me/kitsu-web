import Route from '@ember/routing/route';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  templateName: 'media'
});
