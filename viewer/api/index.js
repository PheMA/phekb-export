const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static("dist"));

app.get("/phenotype", (req, res) => {
  let response = { total: undefined, phenotypes: [] };

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

app.get("/phenotype/:id/:type/:filename", function(req, res) {
  const pattern = `${req.params.id}.`;

  let directory, filePath;
  fs.readdir("data").then(listing => {
    directory = listing.find(item => item.startsWith(pattern));

    const encodedFileName = req.params.filename.replace(/\ /g, "%20");

    // Massive security vulnerability
    filePath = path.join(
      __dirname,
      `../../data/${directory}/${req.params.type}/${encodedFileName}`
    );

    res.sendFile(filePath);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
