import MediaShowRoute from 'client/routes/media/show';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';

export default MediaShowRoute.extend(CanonicalRedirectMixin, {
  mediaType: 'manga'
});
