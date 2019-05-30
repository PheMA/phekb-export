# ⬇️ PheKB Export

Utility that extracts PheKB phenotypes into a semi-structured JSON format.

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

```sh
yarn start
```
