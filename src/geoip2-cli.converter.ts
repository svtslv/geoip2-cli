import * as fs from 'fs';
import { Reader } from 'maxmind';
import { Netmask, ip2long, long2ip } from 'netmask';

export { Netmask, ip2long, long2ip, Reader };

export class Geoip2CliConverter<T> {
  reader: Reader<T>;

  constructor(buffer: Buffer) {
    this.reader = new Reader<T>(buffer);
  }

  static async open<T>(path: string) {
    const buffer = await fs.promises.readFile(path);
    return new Geoip2CliConverter<T>(buffer);
  }

  static openSync<T>(path: string) {
    const buffer = fs.readFileSync(path);
    return new Geoip2CliConverter<T>(buffer);
  }

  getAll() {
    let ip = null;
    let mask = null;
    const result = [];
    const startIp = '0.0.0.0';
  
    while(ip !== startIp) {
      const netmask = new Netmask(`${ ip || startIp }/${ mask || 32 }`);
      ip = long2ip(ip2long(netmask.last) + 2);
      const [info, nextMask] = this.reader.getWithPrefixLength(ip);
      mask = nextMask;
      result.push(info);
    }
  
    return result;
  }

  getUnique() {
    const result = {};

    this.getAll().forEach(info => {
      if (info && info.city && info.city.geoname_id) {
        result[info.city.geoname_id] = info;
      } else if (info && info.country && info.country.geoname_id) {
        result[info.country.geoname_id] = info;
      } else if (info && info.autonomous_system_number) {
        result[info.autonomous_system_number] = info;
      }
    });

    return result;
  }
}