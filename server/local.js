// Local/Docker dev entry point. Vercel's @vercel/node builder imports the
// exported `app` from index.js directly and never runs this file — index.js
// itself must stay listen-free for that to work.
const app = require('./index');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
