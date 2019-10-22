const fs = require("fs").promises;
const fspath = require("path");
const dotenv = require("dotenv");
const { URLSearchParams } = require("url");

const nodeFetch = require("node-fetch");
const fetch = require("fetch-cookie")(nodeFetch);
const cheerio = require("cheerio");
const slugify = require("slugify");

const SELECTORS = require("./selectors");
const phenotypeIds = require("./phekb-phenotypes-calculated.json");

const PHEKB_BASE = "https://phekb.org";
const PHENOTYPE_BASE = `${PHEKB_BASE}/phenotype`;

const ensureDirExists = path => {
  return fs
    .mkdir(fspath.dirname(path), { recursive: true })
    .catch(e => console.log(`Error creating ${path}`, e));
};

const writeFile = (path, data) => {
  return ensureDirExists(path).then(() => fs.writeFile(path, data));
};

const text = page => selector => {
  return page(selector).text();
};

const textArray = page => selector => {
  return page(selector)
    .contents()
    .map((i, e) => cheerio(e).text())
    .get();
};

const files = page => selector => {
  return page(selector)
    .map((i, e) => {
      const f = cheerio(e);

      return {
        name: f.contents().text(),
        url: f.attr("href"),
        type: f.attr("type").split(";")[0],
        length: parseInt(
          f
            .attr("type")
            .split(";")[1]
            .match(/\d+/)[0]
        )
      };
    })
    .get();
};

const getCSL = pmid => {
  const url = `https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=${pmid}`;

  return fetch(url).then(res => res.json());
};

const buildDataDictionaries = ({ page, phenotype }) => {
  phenotype.data_dictionaries = files(page)(
    SELECTORS.DATA_DICTIONARIES.ALL_FILE_LINKS
  );

  return Promise.resolve(phenotype);
};

const getFiles = async ({ localDir, prefix, urls }) => {
  return Promise.all(
    urls.map(url => {
      console.log(`Downloading ${url}`);
      return fetch(url).then(res => {
        const filename = `${localDir}/${prefix}/${url.split("/").pop()}`;

        return ensureDirExists(filename).then(() => {
          console.log(`Writing ${filename}`);

          const fileStream = require("fs").createWriteStream(filename);

          return new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", err => {
              reject(err);
            });
            fileStream.on("finish", function() {
              resolve();
            });
          });
        });
      });
    })
  );
};

const buildPhenotype = async ({ page, url }) => {
  const phenotype = {};
  const t = text(page);
  const ta = textArray(page);

  phenotype.url = url;
  phenotype.name = t(SELECTORS.META.NAME);
  phenotype.slug = slugify(phenotype.name, {
    remove: /[*+~.()'"!:@\/]/g,
    lower: true
  });
  phenotype.id = t(SELECTORS.META.ID);
  phenotype.type = ta(SELECTORS.META.TYPE);
  phenotype.status = t(SELECTORS.META.STATUS);
  phenotype.collaboration_list = t(
    SELECTORS.META.COLLABORATION_LIST
  ).startsWith("List");

  // Get HTML of summary
  phenotype.summary = page(SELECTORS.META.SUMMARY).toString();

  const authors = t(SELECTORS.META.AUTHORS).replace("and ", ",");

  let split_char = ",";

  if (authors.includes(";")) {
    split_char = ";";
  }

  phenotype.authors = authors
    .split(split_char)
    .map(s => s.trim())
    .filter(s => !!s);

  phenotype.contact_author = t(SELECTORS.META.CONTACT_AUTHOR);

  phenotype.age = ta(SELECTORS.META.AGE);
  phenotype.data_modalities = ta(SELECTORS.META.DATA_MODALITIES);
  phenotype.gender = ta(SELECTORS.META.GENDER);
  phenotype.ethnicity = ta(SELECTORS.META.ETHNICITY);

  phenotype.date_created = page(SELECTORS.META.DATE_CREATED).attr("content");
  phenotype.institution = t(SELECTORS.META.INSTITUTION);
  phenotype.network_associations = ta(SELECTORS.META.NETWORK_ASSOCIATIONS);
  phenotype.owner_groups = ta(SELECTORS.META.OWNER_GROUPS);
  phenotype.view_groups = ta(SELECTORS.META.VIEW_GROUPS);
  phenotype.race = ta(SELECTORS.META.RACE);

  phenotype.data_models = ta(SELECTORS.META.DATA_MODELS);

  phenotype.suggested_citation = t(SELECTORS.META.SUGGESTED_CITATION);

  const references = [];
  ta(SELECTORS.META.PUBMED_REFERENCES).forEach(pmid => {
    references.push(getCSL(pmid.trim()));
  });

  phenotype.references = await Promise.all(references);

  phenotype.files = files(page)(SELECTORS.META.FILES);

  const localDir = `./data/${phenotype.id}.${phenotype.slug}`;

  const filename = `${localDir}/${phenotype.id}.${phenotype.slug}.json`;

  fetchDataDictionaries(page(SELECTORS.PAGE.DATA_DICTIONARIES).attr("href"))
    .then(
      html => buildDataDictionaries({ page: cheerio.load(html), phenotype }),
      stepReject(
        `Failed to scrape data dictionaries for phenotype ${phenotype.id}`
      )
    )
    .then(phenotype => writeFile(filename, JSON.stringify(phenotype, null, 2)))
    .then(() => console.log(`Successfully wrote ${filename}`))
    .then(() =>
      getFiles({
        localDir,
        prefix: "files",
        urls: phenotype.files.map(file => file.url)
      })
    )
    .then(() =>
      console.log(`Successfully downloaded files for ${phenotype.slug}`)
    )
    .then(() =>
      getFiles({
        localDir,
        prefix: "data_dicts",
        urls: phenotype.data_dictionaries.map(file => file.url)
      })
    )
    .then(() =>
      console.log(
        `Successfully downloaded data dictionaries for ${phenotype.slug}`
      )
    )
    .catch(e => console.log(`Error writing ${filename}`, e));
};

const login = (user, pass) => {
  const params = new URLSearchParams();
  params.append("name", user);
  params.append("pass", pass);
  params.append("form_id", "user_login");

  return fetch(`${PHEKB_BASE}/user`, {
    method: "POST",
    body: params,
    redirect: "manual"
  }).then(res => {
    if (res.status != 302) {
      // successful login redirect
      console.log("Login failed.");
      process.exit(1);
    } else {
      console.log("Login successful.");
    }
  });
};

const fetchPhenotype = id => {
  return fetch(`${PHENOTYPE_BASE}/${id}`).then(res => res.text());
};

const fetchDataDictionaries = relativeUrl => {
  return fetch(`${PHEKB_BASE}/${relativeUrl}`).then(res => res.text());
};

const getPhenotype = id => {
  return fetchPhenotype(id).then(html => {
    const page = cheerio.load(html);

    // Must have three breadcrumbs, and the middle one must be "Phenotypes"
    if (
      page(SELECTORS.PAGE.CRUMBS).length == 3 &&
      page(SELECTORS.PAGE.CRUMB).text() === "Phenotypes"
    ) {
      return Promise.resolve({ page, url: `${PHENOTYPE_BASE}/${id}` });
    }

    return Promise.reject("Not a phenotype");
  });
};

const stepReject = msg => err => {
  console.log(`${msg}:`, err);
};

const scrape = async id => {
  return getPhenotype(id)
    .then(buildPhenotype, stepReject(`Failed to scrape phenotype ${id}`))
    .then(page => console.log(`Successfully scraped ${id}`));
};

const main = async () => {
  dotenv.config();

  const user = process.env.PHEKB_USER;
  const pass = process.env.PHEKB_PASS;

  if (!user || !pass) {
    console.log(
      "Please set the PHEKB_USER and PHEKB_PASS environment variables."
    );
    process.exit(1);
  }

  await login(user, pass);

  phenotypeIds.ids.forEach(async id => {
    await scrape(id);
  });
};

main();
