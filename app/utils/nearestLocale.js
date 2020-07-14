import preferredLocale from 'preferred-locale';
import LANGUAGES from './languages';

const translatedLocales = LANGUAGES.map(locale => locale.id);

export default preferredLocale(translatedLocales, 'en-us', { regionLowerCase: true });
