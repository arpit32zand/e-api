const fs = require("fs");
fs.readFile("./file1", "utf8", (err, data) => {
  if (err) console.log(err);
  if (data) console.log(data);
});
