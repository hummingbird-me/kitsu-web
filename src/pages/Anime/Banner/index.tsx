import React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
  FormattedEpisodeCount,
  FormattedReleaseStatus,
  FormattedSubtype,
} from '@/components/Formatted';
import TabBar from '@/components/navigation/TabBar';
import { graphql, readFragment, type FragmentOf } from '@/graphql/tada';
import MediaBanner, { MediaBannerFragment } from '@/pages/Media/Banner';
import { paths } from '@/pages/routes';

export const AnimeBannerFragment = graphql(
  `
    fragment AnimeBannerFragment on Anime {
      ...MediaBannerFragment
      status
      startDate
      subtype
      episodeCount
    }
  `,
  [MediaBannerFragment],
);

export type AnimeBannerProps = {
  anime: FragmentOf<typeof AnimeBannerFragment>;
};

function AnimeFactoids(props: AnimeBannerProps) {
  const anime = readFragment(AnimeBannerFragment, props.anime);

  const factoids = [
    <FormattedSubtype subtype={anime.subtype} key="subtype" />,
    anime.startDate && (
      <FormattedDate value={anime.startDate} year="numeric" key="startDate" />
    ),
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

export function AnimeBanner(props: AnimeBannerProps) {
  const anime = readFragment(AnimeBannerFragment, props.anime);
  const route = paths.anime(anime.slug);

  return (
    <MediaBanner media={anime}>
      <MediaBanner.PosterImage source={anime.posterImage} />
      <MediaBanner.Title>{anime.titles?.preferred}</MediaBanner.Title>
      <MediaBanner.Subtitle>
        <AnimeFactoids anime={props.anime} />
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
