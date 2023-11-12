import React from 'react';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import CategoryList from 'app/components/content/CategoryList';
import { Description } from 'app/components/content/Description';
import Reaction from 'app/components/content/Reaction';
import Section from 'app/components/Section';
import Card from 'app/components/surfaces/Card';
import { useLocale } from 'app/contexts/IntlContext';
import AnimeLayout from 'app/pages/Anime/Layout';

import { useFindAnimeBySlugQuery } from './findAnimeBySlug-gql';
import styles from './styles.module.css';

export default function AnimeSummaryPage(): JSX.Element | null {
  const { locale } = useLocale();
  const { slug } = useParams<'slug'>();
  invariant(slug, 'Missing slug on AnimeSummary');
  const results = useFindAnimeBySlugQuery({ variables: { slug, locale } });

  if (!results[0].data?.findAnime) return null;

  const media = results[0].data.findAnime;

  return (
    <AnimeLayout media={media}>
      <div className={styles.content} style={{ minWidth: 0 }}>
        <Card className={styles.descriptionCard}>
          <Description text={media.description['en']} />
          <CategoryList categories={media.categories} />
        </Card>
      </div>
      <div className={styles.communitySidebar}>
        <Section
          className={styles.reactionList}
          title="Reactions"
          link="View All"
          linkTo={`/anime/${media.slug}/reactions`}>
          {media.reactions?.nodes?.map(
            (reaction) =>
              reaction && <Reaction reaction={reaction} key={reaction.id} />,
          )}
        </Section>
      </div>
    </AnimeLayout>
  );
}

export { default as AnimeById } from '../RedirectFromId';
