import { useTranslation } from 'react-i18next';

export default function useLocaleName(): string {
  const { i18n } = useTranslation();
  const locale = i18n.languages[0];
  return locale;
}
