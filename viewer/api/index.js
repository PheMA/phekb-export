const fs = require("fs").promises;

const express = require("express");

const app = express();
const port = 3000;

app.get("/phenotype", (req, res) => {
  const response = {};
  fs.readdir("data").then(listing => {
    response.total = listing.length;
    const all = [];

    listing.forEach(item => {
      let [id, slug] = item.split(".");

      all.push({
        id: parseInt(id),
        slug,
        path: `/phenotype/${id}`
      });
    });

    response.phenotypes = all;

    res.send(response);
  });
});

app.get("/phenotype/:id", function(req, res) {
  const pattern = `${req.params.id}.`;

  let directory, phenotype_path;
  fs.readdir("data").then(listing => {
    directory = listing.find(item => item.startsWith(pattern));

    phenotype_path = `data/${directory}/${directory}.json`;

    fs.readFile(phenotype_path).then(phenotype => {
      res.send(JSON.parse(phenotype));
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
