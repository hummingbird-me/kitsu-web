import Service from 'ember-service';

export default Service.extend({
  trackConversion(id, label, params = {}, remarketing = false) {
    if (window.google_trackConversion) {
      window.google_trackConversion({
        google_conversion_id: id,
        google_conversion_label: label,
        google_remarketing_only: remarketing,
        google_custom_params: params,
        google_conversion_format: '3'
      });
    }
  }
});
