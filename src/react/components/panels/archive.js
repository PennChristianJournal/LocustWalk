
import React, { Component } from 'react';
import { articleHeading } from '../../helpers/article';
import ArticleGroup from '../article-group';

class ArchivePanel extends Component {

  render() {
    return (
      <ArticleGroup name="archive_panel" query={{
        sort: 'date',
        limit: 12,
        published: true,
        featured: true,
      }}>
          {articles =>
            <div className="tile tile-vertical gray-theme">
                <h2 className="strong"><a href="/archive">Archive</a></h2>
                <ul className="clean">
                    {articles.map((article, i) => {
                      return <li key={i}><a href={`/articles/${article.slug}`}>{articleHeading(article)}</a></li>;
                    })}
                </ul>
            </div>
          }
      </ArticleGroup>
    );
  }
}

export default ArchivePanel;
