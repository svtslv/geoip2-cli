#!/usr/bin/env node

import * as chalk from 'chalk';
import * as figlet from 'figlet';
import * as minimist from 'minimist';
import * as path from 'path';
import * as fs from 'fs';
import { Geoip2CliDownloader, Edition } from './geoip2-cli.downloader';
import { Geoip2CliConverter } from './geoip2-cli.converter';

const argv = minimist(process.argv.slice(2));
console.log(chalk.green(figlet.textSync('geoip2-cli', { horizontalLayout: 'full' })));
console.log(chalk.green(`Homepage: ${ require('../package.json').homepage }`));
console.log(chalk.green(`Run with --help to print help\n`));

if (argv.help) {
  console.log([
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
  ].join('\n'));
  process.exit();
}

if (argv.version) {
  console.log('Version: ' + require('../package.json').version, '\n');
  process.exit();
}

const convert = argv.convert;
const download = argv.download;
const licenseKey = argv.licenseKey || process.env.GEOIP2_CLI_LICENCE_KEY;
const editions = argv.editions ? argv.editions.toString().split(',') : ['city'];
const date = argv.date || '';
const mmdbPath = argv.mmdbPath || path.join(process.cwd(), 'geoip2-cli', 'GeoLite2-City.mmdb');
const jsonPath = argv.jsonPath || mmdbPath + '.json';

const downloadPath = argv.downloadPath || path.join(process.cwd(), 'geoip2-cli', date);

if(download || argv._[0] === 'download') {
  (async() => {
    console.log('Downloading maxmind databases...');
    const result: any = {};
    for (const edition of editions) {
      const resultPath = await Geoip2CliDownloader.download({ licenseKey, date, edition: edition as Edition, downloadPath });
      result[edition] = resultPath;
    }
    console.log(result);
  })();
}

if(convert || argv._[0] === 'convert') {
  (async() => {
    console.log('Converting maxmind database...');
    try {
      const dateStart = Date.now();
      const converter = Geoip2CliConverter.openSync(mmdbPath);
      const result = converter.getUnique();
      
      console.log(jsonPath);
      fs.writeFileSync(jsonPath, JSON.stringify(result));
      console.log(`File was saved with`, Object.keys(result).length, 'items.', (Date.now() - dateStart) / 1000 + 's');
    } catch(e) {
      console.log(e.message);
    }
  })();
}
