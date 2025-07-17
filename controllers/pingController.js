// controllers/pingController.js

exports.ping = (req, res) => {
  console.log(`[PING] ${new Date().toISOString()}`);
  res.status(200).send('pong');
};
