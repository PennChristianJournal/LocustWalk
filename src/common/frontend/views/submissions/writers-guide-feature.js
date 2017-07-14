import React from 'react';
import PageLayout from '../../templates/page-layout';
import SistersPanel from '../../components/panels/sisters';
import {headData} from '~/common/frontend/head';

const WritersGuideFeaturePage = () => (
    <PageLayout
        main={[
          <div className="tile tile-vertical white-theme">
              <h2 className="strong">A Writer's Guide - Feature</h2>
              <div className="anchor" id="feature"></div>
              <p>Thank you for your interest in writing for Locust Walk! As a magazine, we are flexible in the topics and writing styles of submissions, however, there are standards that we uphold. Please use the following guidelines to direct your writing. We look forward to hearing from you!</p>
              <ul className="list">
                  <li>May be academic papers, interviews, testimonies, short fiction, poetry, artwork</li>
                  <li>Send to <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a> as a Word attachment (“.doc” please, not “.docx”), single-spaced if written work
                  </li>
                  <li>Include an article summary/blurb of your own fashioning, which will potentially be used as the article’s tagline in the printed issue</li>
                  <li>Include a short biography of yourself that includes such information as year, major, hometown - one sentence is sufficient</li>
                  <li>Any images should be attached separately at the highest resolution possible (do not embed them in the Word document)</li>
              </ul>
              <p><strong>Audience:</strong> We seek to appeal to a broad audience of all students on campus of all faiths and backgrounds. Please keep this in mind in your writing as we are not just writing to other Christians. Articles should be clear and simple enough that non-Christians and Christians alike can understand them.</p>
              <p><strong>Content:</strong> Feature articles should be longer (1000-2000 words), thoughtful, culturally relevant posts that raise questions and search for answers about the great questions of life and seek to foster discussion among Christian and non-Christian worldviews. Suggested topics include but are not limited to: examination of current events, reflections on Penn culture, personal anecdotes, attempts to reconcile science and religion, etc.</p>
              <p>If you are unsure about where to start, let us know at <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a>, and we will pair you with an editor.</p>
              <ul className="list">
                  <li>Send us your pieces at <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a>.
                  </li>
                  <li>Include a short biography of yourself that includes such information as year, major, hometown – one sentence is sufficient.</li>
              </ul>
              <h3>Formatting:</h3>
              <ul className="list">
                  <li>TITLE YOUR PIECE, though the editors might revise it.</li>
                  <li>We use the American standard for punctuation. Commas should be placed inside quotations (i.e. “The Lord is good,” she declared.)</li>
                  <li>Scriptural citations should contain the translation/version and be included as an endnote</li>
                  <li>No abbreviations for the books of the Bible.</li>
                  <li>Please remove all contractions (e.g. “can’t,” “isn’t,” “won’t”).</li>
                  <li>If you are submitting an academic paper that you wrote for class:
                      <ul>
                          <li>Label it as an academic paper, so we know that it is an academic paper</li>
                          <li>Citations should follow <a href="http://www.chicagomanualofstyle.org/tools_citationguide.html">Chicago Style</a>
                          </li>
                          <li>If you already received the grade for the paper, please do not submit the paper unrevised if it received a grade of B or below.</li>
                      </ul>
                  </li>
                  <li>Any images should be attached separately (i.e., do not embed them in the Word document) at the highest resolution possible and preferably as a tiff or JPG.</li>
              </ul>
              <h3>Expectations for Editing:</h3>
              <p>Each writer will be assigned to an editor for his or her article based on the content of that article. Please expect to go through at least one round of edits before your piece is published.</p>
          </div>,
        ]}

        side={[
          <SistersPanel />,
        ]}
    ></PageLayout>
);

export default headData(head => {
  head.setTitle('Feature Writers Guide - Locust Walk');
  const description = 'Thank you for your interest in writing for Locust Walk! As a magazine, we are flexible in the topics and writing styles of submissions, however, there are standards that we uphold. Please use the following guidelines to direct your writing. We look forward to hearing from you!';
  head.setMetadata('description', description.substring(0, 160));
})(WritersGuideFeaturePage);