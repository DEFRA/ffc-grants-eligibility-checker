# FFC-Grants-Eligibility-Checker

**webpack-cli**
Run `npm run build` to bundle application

## Local Setup

Run `npm i` to install package dependencies

In order to start docker compose in development mode you need to export the following env variables:

```
NODE_ENV=<development|production>
PLATFORM=<linux/amd64|linux/arm64>
```

e.g.

```
export NODE_ENV=development
export PLATFORM=linux/arm64
```

Open up your browser and go to: http://localhost:3000/eligibility-checker

#### Authorise Snyk

Run `snyk auth` to authenticate your local machine
