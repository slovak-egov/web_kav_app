
### Save gl access token to NPM_TOKEN

```bash
export NPM_TOKEN=<gitlab token>
```

### Installing Dependencies

Use `npm (min node 18)` to install the dependencies:

```bash
npm install
```
### Running

We can start the next.js server in development mode:

```bash
npm run dev
```

or in production mode:
```bash
npm run build
npm run start
```

The next.js server runs at http://localhost:3000

#### Run develpment server with SSL support

Modern browsers prevent the storage of cookies from non-secure (non-SSL) sites, so the preview mode for unpublished content on the CMS side is not functional. The following section contains commands to create a certificate for the Node.js development server.

create `certs` directory
```bash
mkdir ./certs
```

generate certificate and key for server
```bash
openssl req -x509 -out ./certs/localhost.crt -keyout ./certs/localhost.key \
  -days 365 \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\
   \nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\
   \nextendedKeyUsage=serverAuth")
```

Start HTTPs server

```bash
npm run dev:ssl
```

The next.js server runs at https://localhost:3000

# ÚPVS: WEB Informačný portál kav.sk

Web portal beta.kav.sk

## Environments

### DEV
http://www.kav.dev.skit.zone/

### INT
http://www.kav.int.skit.zone/

### QA
http://www.kav.qa.skit.zone/


## Setup

### Cloning the GitHub Repository

Clone this repository to your local machine:

```bash
git clone git@gitlab.slovenskoit.sk:components/upvs-web-svk/esvk_web_slovensko_sk_app.git
```

### Formatting

Run automatic code formatting (prettier) with this command:

```bash
npm run format
```

### Testing

Run linting and unit tests with this command:

```bash
npm run test-all
```

### UI Translations

To download from Drupal CMS and create (or update) common.json files for UI translations run

```bash
npm run fetch-locales
```
locales.json in root directory and common.json files in public/locales directory will be created (or updated)
Note, by running npm run build, ``npm run fetch-locales`` runs followed by ``next build``.

After adding new phrase or editing its key run

```bash
npm run export-locales
```
translations.svksk_ui_translation.yml file will be created in root directory to be copied to Drupal CMS project.


## Notes

If you are connecting to your local Drupal instance, use ``0.0.0.0`` instead of ``localhost`` or ``127.0.0.1``
