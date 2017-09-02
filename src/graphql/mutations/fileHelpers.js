'use strict';

import SmallFile from '~/common/models/smallFile';

export function updateImages(result, cover_file, thumb_file, context) {
  function createSmallFile(id) {
    var file = context.files.find(file => file.fieldname == id);
    return (file ? SmallFile.create({
      data: file.buffer,
      contentType: file.mimetype,
    }) : Promise.resolve(null));
  }

  const coverImageSaved = createSmallFile(cover_file);
  const thumbImageSaved = createSmallFile(thumb_file);

  return Promise.all([coverImageSaved, thumbImageSaved]).then(([coverImage, thumbImage]) => {
    const coverImageCleared = ((coverImage && result.cover) ?
      SmallFile.findByIdAndRemove(result.cover).exec() : Promise.resolve());

    const thumbImageCleared = ((thumbImage && result.thumb) ?
      SmallFile.findByIdAndRemove(result.thumb).exec() : Promise.resolve());

    if (coverImage) {
      result.cover = coverImage._id;
    }

    if (thumbImage) {
      result.thumb = thumbImage._id;
    }

    return Promise.all([coverImageCleared, thumbImageCleared]);
  });
}
