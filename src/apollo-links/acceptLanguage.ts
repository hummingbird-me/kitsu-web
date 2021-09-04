import { ApolloLink } from '@apollo/client';
import buildAcceptLanguage from 'app/utils/buildAcceptLanguage';

export default ({ locale }: { locale: string }): ApolloLink => {
  const accept = buildAcceptLanguage(locale);

  return new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'Accept-Language': accept,
      },
    }));

    return forward(operation);
  });
};
