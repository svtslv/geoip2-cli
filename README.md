# GeoIP2 CLI

<a href="https://www.npmjs.com/package/geoip2-cli"><img src="https://img.shields.io/npm/v/geoip2-cli.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/geoip2-cli"><img src="https://img.shields.io/npm/l/geoip2-cli.svg" alt="Package License" /></a>

## Table of Contents

- [Description](#description)
- [Command line](#command-line)
- [User in code](#use-in-code)
- [License](#license)

## Description

Code and command-line utils for download and convert geoip2 maxmind mmdb

## Command line

#### Globally via `npm`

```sh
npm install --global geoip2-cli
```

#### Running on-demand:

```sh
npx geoip2-cli [options]
```

### Examples

```sh
npx geoip2-cli --help
```

```sh
    'usage: geoip2-cli [options]',
    '',
    'options:',
    '  --download       Download [false]',
    '  --downloadPath   Path to download [./geoip2-cli]',
    '  --licenseKey     Your license key [error]',
    '  --editions       Editions: city, country, asn [city]',
    '  --date           Database date version [empty]',
    '',
    '  --convert        Convert [false]',
    '  --mmdbPath       Path to .mmdb [./geoip2-cli/GeoLite2-City.mmdb]',
    '  --jsonPath       Path to .json [mmdbPath + .json]',
    '',
    '  --help           Print this list and exit',
    '  --version        Print the version and exit.',
    '',
    'env:',
    '  GEOIP2_CLI_LICENCE_KEY',
```

## Use in code

### Installation

```bash
npm install geoip2-cli
```

### Examples

```ts
import { Geoip2CliDownloader } from 'geoip2-cli';

await Geoip2CliDownloader
    .download({ licenseKey, date, edition, downloadPath })
    .then(path => console.log(path));
```

```ts
import { Geoip2CliConverter } from 'geoip2-cli';

const converter = Geoip2CliConvert.openSync('GeoLite2-City.mmdb');
const result = converter.getUnique();
```

## License

MIT
