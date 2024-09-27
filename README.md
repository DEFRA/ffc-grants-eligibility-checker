# FFC-Grants-Eligibility-Checker

**webpack-cli**
Run `npm run build` to bundle application

## Local Setup

Run `npm i` to install package dependencies

In order to start docker compose locally for ARM arch you need to uncomment PLATFORM env variables:

```
PLATFORM=<linux/amd64|linux/arm64>
```

Open up your browser and go to: http://localhost:3000/eligibility-checker/exampleGrant

#### Authorise Snyk

Run `snyk auth` to authenticate your local machine
