const request = require('request-promise-native');
const JSON = require('json5')

module.exports = class MiniclipConfig {
  constructor() {
    this.env = {};
    this.id = 0;
    this.baseURL = '';
    this.config = {};
    this.protocol = 'https';
  }

  async fetchInfo() {
    await this.getEnv();
    await this.getID();
    await this.getConfig();
  }
  
  async getEnv() {
    const envJS = await request(`${this.protocol}://agar.io/environment.js`);
    this.env = JSON.parse(envJS.slice(17));
  }

  async getID() {
    this.id = await request(`${this.protocol}://${this.env.master_url}/getLatestID`);
    this.baseURL = `${this.env.config_url}/${this.id}`;
  }

  async getConfig() {
    const config = await request(`${this.baseURL}/GameConfiguration.json`);
    this.config = JSON.parse(config).gameConfig;
  }
};
