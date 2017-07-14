
import React from 'react';
import PageLayout from '../templates/page-layout';
import ArchivePanel from '../components/panels/archive';
import SistersPanel from '../components/panels/sisters';
import SocialPanel from '../components/panels/social';
import ArticleThumb from '../components/article-thumb';
import FeatureSlider from '../components/feature-slider';
import Optional from '../components/optional';
import {graphql, gql} from 'react-apollo';
import { headData } from '~/common/frontend/head';

const FEATURED_ARTICLES_QUERY = gql`
  query FeaturedArticles($skip: Int!) {
    featuredArticles(limit: 1, skip: $skip) {
      _id
      title
      slug
      date
      thumb
      author
      preview(length: 140)
      heading_override  
    }
  }
`;

const FeatureSliderWithData = graphql(FEATURED_ARTICLES_QUERY, {
  options: {
    variables: {
      skip: 0,
    },
  },
  props({ data: {loading, featuredArticles, fetchMore } }) {
    return {
      loading,
      featuredArticles,
      loadMore() {
        if (featuredArticles.length >= 12) {
          return;
        }
        return fetchMore({
          variables: {
            skip: (featuredArticles || []).length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              featuredArticles: [...previousResult.featuredArticles, ...fetchMoreResult.featuredArticles],
            });
          },
        });
      },
    }; 
  },
})( ({loading, featuredArticles, loadMore}) => {
  return <FeatureSlider loadMore={loadMore} articles={featuredArticles || []} />;
});

const RECENT_ARTICLES_QUERY = gql`
  query RecentArticles($skip: Int!) {
    recentArticles(limit: 10, skip: $skip) {
      title
      slug
      preview(length: 300)
      date
      author
      thumb 
    }
  }
`;

const RecentArticlesWithData = graphql(gql`
  query RecentArticlesWithCount($skip: Int!) {
    recentArticles(limit: 10, skip: $skip) {
      title
      slug
      preview(length: 300)
      date
      author
      thumb 
    }
    articleCount
  }
`, {
  options: {
    variables: {
      skip: 0,
    },
  },
  props({ data: {loading, recentArticles, articleCount, fetchMore } }) {
    return {
      loading,
      recentArticles,
      loadMore() {
        return fetchMore({
          query: RECENT_ARTICLES_QUERY,
          variables: {
            skip: recentArticles.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              recentArticles: [...previousResult.recentArticles, ...fetchMoreResult.recentArticles],
            });
          },
        });
      },
      hasMore() {
        return recentArticles && recentArticles.length < articleCount;
      },
    }; 
  },
})( ({loading, recentArticles, loadMore, hasMore}) => {
  recentArticles = recentArticles || [];
  return (
    <div className="tile tile-vertical white-theme">
        <h2 className="strong">Recent Articles</h2>
        {recentArticles.map((article, i) => {
          return <ArticleThumb article={article} key={i} />;
        })}
        <Optional test={hasMore()}>
          <button className="btn btn-default center-block" onClick={loadMore}>Load More</button>
        </Optional>
    </div>
  );
});

const HomePage = () => (
     <PageLayout id="home-page"
        top={[
          <FeatureSliderWithData />,
        ]}

        main={<RecentArticlesWithData />}

        side={[
          <div className="row">
              <div className="col-md-12 col-sm-6">
                  <SistersPanel />
              </div>
          </div>,
          <div className="row">
              <div className="col-md-12 col-xs-6">
                  <SocialPanel />
              </div>
              <div className="col-md-12 col-xs-6">
                  <ArchivePanel />
              </div>
          </div>,
        ]}
    />
);

export default headData(head => {
  head.addLink({
    href: '/css/home.css',
    rel: 'stylesheet',
    type: 'text/css',
  });
})(HomePage);
