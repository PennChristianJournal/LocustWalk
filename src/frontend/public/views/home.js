
import React, {Component} from 'react';
import { Helmet } from 'react-helmet';
import PanelPage from '../components/panel-page';
import ArchivePanel from '../components/panels/archive';
import SistersPanel from '../components/panels/sisters';
import SocialPanel from '../components/panels/social';
import ArticleThumb from '../components/article-thumb';
import FeatureSlider from '../components/feature-slider';
import Optional from '../../common/components/optional';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const FEATURED_ARTICLES_QUERY = gql`
  query FeaturedArticles($skip: Int!) {
    features(is_published: true, limit: 2, skip: $skip) {
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
    featureCount
  }
`;

const FeatureSliderWithData = graphql(FEATURED_ARTICLES_QUERY, {
  options: {
    variables: {
      skip: 0,
    },
    notifyOnNetworkStatusChange: true,
  },
  props({ data: {loading, features, featureCount, fetchMore } }) {
    features = features || [];
    return {
      loading,
      features,
      loadMore() {
        if (loading) {
          return;
        }
        const page = features.length;
        return fetchMore({
          variables: {
            skip: page,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            return Object.assign({}, previousResult, {
              features: [...previousResult.features, ...fetchMoreResult.features],
            });
          },
        });
      },
      hasMore() {
        return features.length < featureCount;
      },
    };
  },
})( ({loading, features, hasMore, loadMore}) => {
  return <FeatureSlider features={features} hasMore={hasMore} loadMore={loadMore} />;
});

class RecentArticles extends Component {

  constructor(props) {
    super(props);

    this._checkLoadMore = this.checkLoadMore.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this._checkLoadMore);
    window.addEventListener('resize', this._checkLoadMore);
    this._checkLoadMore();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._checkLoadMore);
    window.removeEventListener('resize', this._checkLoadMore);
  }

  checkLoadMore(e) {
    if (this.props.hasMore()) {
      const rect = this.refs.container.getBoundingClientRect();
      if (rect.y + rect.height - window.innerHeight < 200) {
        this.props.loadMore();
      }
    }
  }

  render() {
    return (
      <div className="tile tile-vertical white-theme" ref="container">
        <h2 className="strong">Recent Articles</h2>
        {this.props.articles.map((article) => {
          return <ArticleThumb article={article} key={article._id} />;
        })}
      </div>
    );
  }
};

const RecentArticlesWithData = graphql(gql`
  query RecentArticlesWithCount($skip: Int!) {
    articles(limit: 10, skip: $skip) {
      _id
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
  props({ data: {loading, articles, articleCount, fetchMore } }) {
    articles = articles || [];
    return {
      loading,
      articles,
      loadMore() {
        if (loading) {
          return;
        }
        const page = articles.length;
        return fetchMore({
          variables: {
            skip: page,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            return Object.assign({}, previousResult, {
              articles: [...previousResult.articles, ...fetchMoreResult.articles],
            });
          },
        });
      },
      hasMore() {
        return articles.length < articleCount;
      },
    };
  },
})(RecentArticles);

const HomePage = () => [
  <Helmet key="helmet">
    <title>Locust Walk</title>
    <meta name="description" content={'Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect.'.substring(0, 160)} />
  </Helmet>,
  <div className="container" key="main">
      <div className="row">
          <div className="col-lg-12" id="top">
              <FeatureSliderWithData />
          </div>
      </div>
      <div className="row">
          <div className="col-lg-12">
              <div className="row">
                  <div className="col-lg-9 col-md-8 col-sm-8 col-xs-7" id="main">
                      <RecentArticlesWithData />
                  </div>
                  <div className="col-lg-3 col-md-4 col-sm-4 col-xs-5" id="side">
                    <div className="row">
                        <div className="col-lg-12">
                            <SistersPanel />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <SocialPanel />
                        </div>
                        <div className="col-lg-12">
                            <ArchivePanel />
                        </div>
                    </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
];

export default HomePage;
