const crypto = require('crypto');
const {choosePosts, publicPost, insert, json, method} = require('./_lib');
module.exports = async (req, res) => {
  if (!method(req, res, 'POST')) return;
  try {
    const participantId = crypto.randomUUID();
    const posts = choosePosts().map(publicPost);
    await insert({record_type: 'session', participant_id: participantId, payload: {assignedPostIds: posts.map(post => post.post_id), posts}});
    json(res, 201, {participantId, posts});
  } catch (error) { json(res, 500, {error: error.message}); }
};
