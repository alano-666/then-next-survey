const {insert, json, method} = require('./_lib');
module.exports = async (req, res) => {
  if (!method(req, res, 'POST')) return;
  try {
    const body = req.body || {};
    if (!body.participantId || !body.event) return json(res, 400, {error: 'participantId and event are required'});
    await insert({record_type: 'event', participant_id: body.participantId, post_id: body.postId || null, payload: body});
    json(res, 201, {ok: true});
  } catch (error) { json(res, 500, {error: error.message}); }
};
