import React from 'react';
import PageLayout from '../../templates/page-layout';
import SistersPanel from '../../components/panels/sisters';

const WritersGuideResponsePage = () => (
    <PageLayout
        main={[
          <div className="tile tile-vertical white-theme">
              <h2 className="strong">A Writer's Guide - Response</h2>
              <div className="anchor" id="response"></div>
              <p>Thank you for your interest in writing for Locust Walk! As a magazine, we are flexible in the topics and writing styles of submissions, however, there are standards that we uphold. Please use the following guidelines to direct your writing. We look forward to hearing from you!</p>
              <ul className="list">
                  <li>May be academic papers, interviews, testimonies, short fiction, poetry, artwork</li>
                  <li>Send to <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a> as a Word attachment (“.doc” please, not “.docx”), single-spaced if written work
                  </li>
                  <li>Include an article summary/blurb of your own fashioning, which will potentially be used as the article’s tagline on our social media and in the printed issue</li>
                  <li>If you wish to have your response piece published on a specific Sunday, please have the first draft submitted by the <strong>previous Tuesday 11:59pm</strong>. You will be assigned an editor to review your work and final drafts are due <strong>Saturday 11:59 pm</strong>.</li>
                  <li>Include a short biography of yourself that includes such information as year, major, hometown - one sentence is sufficient</li>
                  <li>Any images should be attached separately at the highest resolution possible (do not embed them in the Word document)</li>
              </ul>
              <p><strong>Audience:</strong> We seek to appeal to a broad audience of all students on campus of all faiths and backgrounds. Please keep this in mind in your writing as we are not just writing to other Christians. Articles should be clear and simple enough that non-Christians and Christians alike can understand them.</p>
              <p><strong>Content:</strong>Response pieces should aim to build on the ideas and themes addressed in the monthly feature piece. Responses may be shorter blog-style pieces (800-1000 words) but are not limited to written content. Artwork, photography, and other creative forms will be carefully considered so long as they are thoughtful, culturally relevant posts that raise questions and search for answers about the great questions of life and seek to foster discussion among Christian and non-Christian worldviews. Suggested topics include but are not limited to: responses to current events, reflections on Penn culture, personal anecdotes, attempts to reconcile science and religion, etc. If you are unsure about where to start, let us know at <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a>, and we will pair you with an editor.</p>
              <ul className="list">
                  <li>Send us your piece at <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a>.
                  </li>
                  <li>Include a short biography of yourself that includes such information as year, major, hometown – one sentence is sufficient.</li>
              </ul>
              <h3>Formatting:</h3>
              <ul className="list">
                  <li>TITLE YOUR PIECE, though the editors might revise it.</li>
                  <li>We use the American standard for punctuation. Commas should be placed inside quotations (i.e. “The Lord is good,” she declared.)</li>
                  <li>Scriptural citations should contain the translation/version and be included as an endnote.</li>
                  <li>No abbreviations for the books of the Bible.</li>
                  <li>Please remove all contractions (e.g. “can’t,” “isn’t,” “won’t”).</li>
                  <li>If you are submitting a testimony: Try to be as concrete and detailed as possible. It is easy to be vague when describing your encounter with God (i.e. “And then, suddenly, He met me.”)</li>
                  <li>Use relevant Bible verses!</li>
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

export default WritersGuideResponsePage;

