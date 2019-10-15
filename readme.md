# ⬇️ PheKB Exporter & Viewer

Utility that extracts PheKB phenotypes into a semi-structured JSON format, a
simple API that serves them up, and an UI that can be used to view them.

## Requirements

1. NodeJS 10+

## Setup

1. Install dependencies

```sh
npm install -g yarn && yarn install
```

2. Setup Credentials

Create a file called `.env` in the workspace root that looks like:

```bash
PHEKB_USER=email@domain.com
PHEKB_PASS=s3cretp4ss
```

## Run

### Scraper

```sh
yarn run update-data
```

:bulb: This will delete your local data and generate a fresh copy by scraping
PheKB.

### Viewer

```
yarn run viewer
```

This will spin up the express api at http://localhost:3000/phenotype and serve
up the web app at http://localhost:1234.
