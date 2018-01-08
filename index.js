const { get } = require('axios');
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
    const envJS = (await get(`${this.protocol}://agar.io/environment.js`)).data;
    this.env = JSON.parse(envJS.slice(17));
  }

  async getID() {
    this.id = (await get(`${this.protocol}://${this.env.master_url}/getLatestID`)).data;
    this.baseURL = `${this.env.config_url}/${this.id}`;
  }

  async getConfig() {
    this.config = (await get(`${this.baseURL}/GameConfiguration.json`)).data.gameConfig;
  }
};
