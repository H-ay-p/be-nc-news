const app = require("./app.js");
const { PORT = 9090 } = process.env;

// app.listen(PORT, (err) => {
//   if (err) console.log(err);
//   console.log(`listening on port ${PORT}`);
// });

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
