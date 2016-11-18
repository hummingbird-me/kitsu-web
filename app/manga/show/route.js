import MediaShowRoute from 'client/media/show/route';
import CanonicalRedirectMixin from 'client/mixins/routes/canonical-redirect';

export default MediaShowRoute.extend(CanonicalRedirectMixin, {
  mediaType: 'manga'
});
