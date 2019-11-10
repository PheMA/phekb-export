const fs = require("fs").promises;
const { parse } = require("json2csv");

const transform = phenotype => {
  const skip = ["summary"];

  const stringArrays = [
    "type",
    "authors",
    "age",
    "data_modalities",
    "gender",
    "ethnicity",
    "institution",
    "network_associations",
    "owner_groups",
    "view_groups",
    "race",
    "data_models"
  ];

  let transformed = {};

  Object.keys(phenotype).forEach(key => {
    if (stringArrays.includes(key)) {
      transformed[key] = phenotype[key].join("\n");
    } else if (key === "references") {
      transformed[key] = phenotype[key].map(ref => ref.title).join("\n");
    } else if (key === "files") {
      transformed[key] = phenotype[key]
        .map(file => file.url.split("/").pop())
        .join("\n");
    } else if (key == "data_dictionaries") {
      transformed[key] = phenotype[key]
        .map(dict => dict.url.split("/").pop())
        .join("\n");
    } else if (key == "date_created") {
      transformed[key] = phenotype[key].substring(0, 10);
    } else if (key == "implementations") {
      transformed[key] = phenotype[key].map(impl => impl.title).join("\n");
    } else if (skip.includes(key)) {
      /* noop */
    } else {
      transformed[key] = phenotype[key];
    }
  });

  return transformed;
};

const main = () => {
  const all = [];

  fs.readdir("data")
    .then(listing => {
      listing.forEach(item => {
        let filename = `./data/${item}/${item}.json`;
        all.push(transform(require(filename)));
      });
    })
    .then(() => {
      const csv = parse(all);
      console.log(csv);
    });
};

main();
