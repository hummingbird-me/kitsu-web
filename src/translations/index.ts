type Translations = {
  [key: string]: string | Translations;
};

const translations: Record<string, () => Promise<Translations>> =
  import.meta.glob('./*.yaml');

export default translations;
