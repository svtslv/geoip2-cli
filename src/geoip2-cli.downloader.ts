import * as fs from 'fs';
import * as https from 'https';
import * as zlib from 'zlib';
import * as path from 'path';
import * as tar from 'tar';

export const EDITIONS = {
  city: 'GeoLite2-City',
  country: 'GeoLite2-Country',
  asn: 'GeoLite2-ASN',
} as const;

export type Edition = keyof typeof EDITIONS;

export class Geoip2CliDownloader {

  static async download(payload: { licenseKey: string, edition: Edition, date: string, downloadPath: string }) {
    const { licenseKey, edition, date, downloadPath } = payload;

    if (!licenseKey) {
      console.error(`Error: License key is not configured.\n
      You need to signup for a _free_ Maxmind account to get a license key.
      Go to https://www.maxmind.com/en/geolite2/signup, obtain your key and
      put it in the --licenseKey option or environment variable\n`);
      return null;
    }

    if (Object.keys(EDITIONS).indexOf(edition) === -1) {
      console.error('Error: You didn\'t set the edition');
      return null;
    }

    if (!downloadPath) {
      console.error('Error: You didn\'t set the output');
      return null;
    }

    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath);
    }

    const link = 'https://download.maxmind.com/app/geoip_download';
    const url = `${link}?license_key=${licenseKey}&edition_id=${EDITIONS[edition]}&date=${date}&suffix=tar.gz`;

    console.log(url);

    return await new Promise(resolve => {
      https.get(url, response => {
        response
        .pipe(zlib.createGunzip().on('error', () => console.log('Link not found. Invalid licenseKey?')))
        .pipe(tar.t()).on('entry', (entry: any) => {
          if (entry.path.endsWith('.mmdb')) {
            const dstFilename = path.join(downloadPath, path.basename(entry.path));
            entry.pipe(fs.createWriteStream(dstFilename));
            resolve(dstFilename);
          }
        });
      });
    });
  }
}