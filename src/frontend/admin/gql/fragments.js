import gql from 'graphql-tag';

export const ArticleFields = gql`
  fragment ArticleFields on Article {
    _id
    title
    is_published
    slug
    url
    cover
    thumb
    date
    author
    preview(length: 300)
    parent {
      _id
      title
    }
    topic {
      _id
      title
    }
  }
`;

export const TopicFields = gql`
  fragment TopicFields on Topic {
    _id
    title
    is_published
    slug
    url
    preview(length: 300)
    cover
    thumb
    articles {
      ...ArticleFields
    }
  }
  ${ArticleFields}
`;

export const FeatureFields = gql`
  fragment FeatureFields on Feature {
    _id
    title
    index
    is_published
    mainItem {
      ...on Article {
        ...ArticleFields
      }
      ...on Topic {
        ...TopicFields
      }
      __typename
    }
    secondaryItems {
      ...on Article {
        ...ArticleFields
      }
      ...on Topic {
        ...TopicFields
      }
      __typename
    }
  }
  ${TopicFields}
`;
