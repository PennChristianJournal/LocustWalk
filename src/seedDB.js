import faker from 'faker';
import Promise from 'bluebird';
import Article from './models/article';
import Topic from './models/topic';
import Feature from './models/feature';
import SmallFile from './models/smallFile';
import { parseBuffer } from './graphql/types/buffer';

Promise.all([
  Article.count(),
  Topic.count(),
  Feature.count(),
]).then(([articleCount, topicCount, featureCount]) => {

  const createTopics = [];
  for (let i = topicCount; i < 10; ++i) {
    const cover = parseBuffer(unescape(faker.image.dataUri('1600px', '600px')));
    const thumb = parseBuffer(unescape(faker.image.dataUri('800px', '600px')));

    Promise.all([
      SmallFile.create({
        data: cover,
        contentType: cover.mimeType,
      }),
      SmallFile.create({
        data: thumb,
        contentType: thumb.mimeType,
      })
    ]).then(([coverImage, thumbImage]) => {
      createTopics.push(Topic.create({
        title: faker.lorem.words(),
        is_published: faker.random.boolean(),
        content: `<p>${faker.lorem.words(500)}</p>`,
        slug: faker.lorem.slug(),
        cover: coverImage._id,
        thumb: thumbImage._id,
      }));
    });
  }

  const createArticles = [];
  for (let i = articleCount; i < 100; ++i) {
    const cover = parseBuffer(unescape(faker.image.dataUri('1600px', '600px')));
    const thumb = parseBuffer(unescape(faker.image.dataUri('800px', '600px')));

    Promise.all(createTopics).then(() => Promise.all([
      SmallFile.create({
        data: cover,
        contentType: cover.mimeType,
      }),
      SmallFile.create({
        data: thumb,
        contentType: thumb.mimeType,
      }),
      Topic.count().then(count => Topic.findOne().skip(Math.random() * count)),
      Article.count().then(count => Article.findOne().skip(Math.random() * count)),
    ]).then(([coverImage, thumbImage, topic, parent]) => {
      createArticles.push(Article.create({
        title: faker.lorem.words(),
        is_published: faker.random.boolean(),
        date: faker.date.past(),
        author: faker.name.findName(),
        content: `<p>${faker.lorem.words(500)}</p>`,
        slug: faker.lorem.slug(),
        cover: coverImage._id,
        thumb: thumbImage._id,
        topic: Math.random() > 0.5 ? topic._id : undefined,
        parent: Math.random() > 0.5 ? parent._id : undefined,
      }));
    }));
  }

  function randomTopicOrArticle() {
    const Model = (Math.random() > 0.5 ? Topic : Article);
    return Model.count()
      .then(count => Model.findOne()
        .skip(Math.random() * count)
        .then(doc => ({
          _id: doc._id,
          _typename: Model.modelName,
        }))
      );
  }

  for (let i = featureCount; i < 50; ++i) {
    Promise.all([...createTopics, ...createArticles]).then(() => Promise.all([
      randomTopicOrArticle(),
      ...[...(new Array(parseInt(Math.random() * 5)))].map(randomTopicOrArticle),
    ])).then(([mainItem, ...secondaryItems]) => {
      Feature.create({
        title: faker.lorem.words(),
        index: i,
        is_published: faker.random.boolean(),
        mainItem,
        secondaryItems
      });
    });
  }
});
