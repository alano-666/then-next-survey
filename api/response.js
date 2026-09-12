const {insert, json, method} = require('./_lib');
module.exports = async (req, res) => {
  if (!method(req, res, 'POST')) return;
  try {
    const body = req.body || {};
    if (!body.participantId || !body.scope || !body.answers) return json(res, 400, {error: 'invalid response'});
    await insert({record_type: 'response', participant_id: body.participantId, post_id: body.postId || null, scope: body.scope, payload: body});
    json(res, 201, {ok: true});
  } catch (error) { json(res, 500, {error: error.message}); }
};
