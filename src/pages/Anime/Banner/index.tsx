import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
  FormattedEpisodeCount,
  FormattedReleaseStatus,
  FormattedSubtype,
} from 'app/components/Formatted';
import TabBar from 'app/components/navigation/TabBar';
import MediaBanner from 'app/pages/Media/Banner';
import { paths } from 'app/pages/routes';

import { AnimeBannerFieldsFragment } from './fields-gql';

function AnimeFactoids({
  anime,
}: {
  anime: AnimeBannerFieldsFragment;
}): JSX.Element {
  const startDate = anime.startDate && (
    <FormattedDate value={anime.startDate} year="numeric" key="startDate" />
  );

  const factoids = [
    <FormattedSubtype subtype={anime.subtype} key="subtype" />,
    startDate,
    <FormattedReleaseStatus releaseStatus={anime.status} key="releaseStatus" />,
    'episodeCount' in anime && anime.episodeCount && (
      <FormattedEpisodeCount
        episodeCount={anime.episodeCount}
        key="episodeCount"
      />
    ),
  ];
  return (
    <>
      {factoids
        .filter((e) => !!e)
        .flatMap((e) => [' · ', e])
        .slice(1)}
    </>
  );
}

export function AnimeBanner({ anime }: { anime: AnimeBannerFieldsFragment }) {
  const route = paths.anime(anime.slug);

  return (
    <MediaBanner media={anime}>
      <MediaBanner.PosterImage source={anime.posterImage} />
      <MediaBanner.Title>{anime.titles?.preferred}</MediaBanner.Title>
      <MediaBanner.Subtitle>
        <AnimeFactoids anime={anime} />
      </MediaBanner.Subtitle>
      <MediaBanner.TabBar>
        <TabBar.LinkItem to={route}>
          <FormattedMessage
            id="media.show.navigation.summary"
            defaultMessage="Summary"
            description="media -> show -> navigation -> summary"
          />
        </TabBar.LinkItem>
        <TabBar.LinkItem to={route.episodes()}>
          <FormattedMessage
            id="media.show.navigation.episodes"
            defaultMessage="Episodes"
            description="media -> show -> navigation -> episodes"
          />
        </TabBar.LinkItem>
        <TabBar.LinkItem to={route.characters()}>
          <FormattedMessage
            id="media.show.navigation.characters"
            defaultMessage="Characters"
            description="media -> show -> navigation -> characters"
          />
        </TabBar.LinkItem>
        <TabBar.LinkItem to={route.staff()}>
          <FormattedMessage
            id="media.show.navigation.staff"
            defaultMessage="Staff"
            description="media -> show -> navigation -> staff"
          />
        </TabBar.LinkItem>
        <TabBar.LinkItem to={route.reactions()}>
          <FormattedMessage
            id="media.show.navigation.reactions"
            defaultMessage="Reactions"
            description="media -> show -> navigation -> reactions"
          />
        </TabBar.LinkItem>
        <TabBar.LinkItem to={route.franchise()}>
          <FormattedMessage
            id="media.show.navigation.franchise"
            defaultMessage="Franchise"
            description="media -> show -> navigation -> franchise"
          />
        </TabBar.LinkItem>
        <TabBar.LinkItem to={route.quotes()}>
          <FormattedMessage
            id="media.show.navigation.quotes"
            defaultMessage="Quotes"
            description="media -> show -> navigation -> quotes"
          />
        </TabBar.LinkItem>
      </MediaBanner.TabBar>
    </MediaBanner>
  );
}
