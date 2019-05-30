const fs = require("fs").promises;
const fspath = require("path");
const dotenv = require("dotenv");
const { URLSearchParams } = require("url");

const nodeFetch = require("node-fetch");
const fetch = require("fetch-cookie")(nodeFetch);
const cheerio = require("cheerio");
const slugify = require("slugify");

const SELECTORS = require("./selectors");

const PHEKB_BASE = "https://phekb.org";
const PHENOTYPE_BASE = `${PHEKB_BASE}/phenotype`;
const START_PHENOTYPE_ID = 8; //170;
const END_PHENOTYPE_ID = 2000;

const ensureDirExists = path => {
  return fs.mkdir(fspath.dirname(path), { recursive: true });
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

const buildMeta = ({ page, url }) => {
  const meta = {};
  const t = text(page);
  const ta = textArray(page);

  meta.url = url;
  meta.name = t(SELECTORS.META.NAME);
  meta.slug = slugify(meta.name, { remove: /[*+~.()'"!:@]/g, lower: true });
  meta.id = t(SELECTORS.META.ID);
  meta.type = t(SELECTORS.META.TYPE);

  meta.authors = t(SELECTORS.META.AUTHORS)
    .replace("and ", ",")
    .split(",")
    .map(s => s.trim())
    .filter(s => !!s);

  meta.age = ta(SELECTORS.META.AGE);
  meta.data_modalities = ta(SELECTORS.META.DATA_MODALITIES);
  meta.gender = ta(SELECTORS.META.GENDER);
  meta.ethnicity = ta(SELECTORS.META.ETHNICITY);

  meta.date_created = page(SELECTORS.META.DATE_CREATED).attr("content");
  meta.institution = t(SELECTORS.META.INSTITUTION);
  meta.network_associations = ta(SELECTORS.META.NETWORK_ASSOCIATIONS);
  meta.owner_groups = ta(SELECTORS.META.OWNER_GROUPS);
  meta.view_groups = ta(SELECTORS.META.VIEW_GROUPS);
  meta.race = ta(SELECTORS.META.RACE);

  meta.files = files(page)(SELECTORS.META.FILES);

  const filename = `./data/${meta.slug}/${meta.slug}.${meta.id}.json`;

  writeFile(filename, JSON.stringify(meta, null, 2))
    .then(() => console.log(`Successfully wrote ${filename}`))
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
    .then(buildMeta, stepReject(`Failed to scrape phenotype ${id}`))
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

  for (let i = START_PHENOTYPE_ID; i < END_PHENOTYPE_ID; i++) {
    await scrape(i);
  }
};

main();
