import * as Registry from 'npm-registry';
import * as RSS from 'rss';

class NpmService {

  private npm: Registry = new Registry({
    registry: 'https://registry.npmjs.org'
  });

  public async getRss(name: string): Promise<any> {
    var pkg = await this.getPackage(name);
    var releases = await this.getReleases(name);
    delete releases.latest;
    var versions = Object.keys(releases).map(key => releases[key]).sort((a, b) => b.date.getTime() - a.date.getTime());
    return this.formatRss(name, pkg, versions.slice(0, Math.min(versions.length, 10)));
  }

  public async getPackage(name: string): Promise<any> {
    var me = this;
    return new Promise((resolve, reject) => {
      me.npm.packages.get(name, (err, pkg) => {
        if (err) {
          reject(err);
        } else {
          resolve(pkg.length === 1 ? pkg[0] : null);
        }
      });
    });
  }

  public async getReleases(name: string): Promise<any> {
    var me = this;
    return new Promise((resolve, reject) => {
      me.npm.packages.releases(name, (err, releases) => {
        if (err) {
          reject(err);
        } else {
          resolve(releases);
        }
      });
    });
  }

  public formatRss(name: string, pkg: any, versions: Array<any>): any {
    var feed = new RSS(<any> {
      title: 'NPM Package: ' + name,
      description: pkg.description,
      site_url: 'https://www.npmjs.com/package/' + name,
      image_url: pkg._npmUser ? pkg._npmUser.gravatar : null
    });
    versions.forEach(version => {
      feed.item(<any> {
        title: name + ':' + version.version,
        guid: name + ':' + version.version,
        url: version.dist.tarball,
        date: version.date,
        author: version.author ? version.author.name : null
      })
    });
    return feed.xml();
  }
}

export default NpmService;
