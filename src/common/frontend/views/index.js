
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
  query FeaturedArticles {
    features(is_published: true) {
      title
      mainItem {
        _id
        title
        url
        thumb
        preview(length: 140)
        ...on Article {
          author
          date
        }
        __typename
      }
      secondaryItems {
        _id
        title
        url
        thumb
        preview(length: 140)
        ...on Article {
          author
          date
        }
        __typename
      }
    }
  }
`;

const FeatureSliderWithData = graphql(FEATURED_ARTICLES_QUERY, {
  options: {
    notifyOnNetworkStatusChange: true,
  },
  props({ data: {loading, features, fetchMore } }) {
    features = features || [];
    return {
      loading,
      features,
    };
  },
})( ({loading, features}) => {
  return <FeatureSlider features={features} />;
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
    notifyOnNetworkStatusChange: true,
  },
  props({ data: {loading, recentArticles, articleCount, fetchMore } }) {
    recentArticles = recentArticles || [];
    return {
      loading,
      recentArticles,
      loadMore() {
        if (loading) {
          return;
        }
        const page = recentArticles.length;
        return fetchMore({
          query: RECENT_ARTICLES_QUERY,
          variables: {
            skip: page,
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
        return recentArticles.length < articleCount;
      },
    };
  },
})( ({loading, recentArticles, loadMore, hasMore}) => {
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
