const app = require("./app.js");
const PORT = 6000;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`listening on port ${PORT}`);
});
