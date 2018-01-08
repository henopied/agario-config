const axios = require('axios');
const { serial, parallel } = require('items-promise');
const path = require('path');
const fs = require('fs-then-native');
const MiniclipConfig = require('..');

(async () => {
  const skinDir = path.resolve(__dirname, 'skins');
  if (!fs.existsSync(skinDir)) fs.mkdir(skinDir);

  const miniclipConfig = new MiniclipConfig();
  await miniclipConfig.fetchInfo();
  const freeSkins = miniclipConfig.config['Gameplay - Free Skins'];
  const premiumSkins = miniclipConfig.config['Gameplay - Equippable Skins'];

  serial(freeSkins.concat(premiumSkins), downloadSkin);

  async function downloadSkin({ image }) {
    const url = image.replace(/\.png/, '_hi.png');
    console.log(`Currently downloading: ${url}`);
    let download = null;
    try {
      download = (await axios({ method: 'get', url: `${miniclipConfig.baseURL}/${url}`, responseType: 'arraybuffer' })).data;
    } catch(e) {
      console.log(`Error downloading ${url}: ${e}`);
      return;
    }
    const location = path.resolve(skinDir, image);
    await fs.writeFile(location, download);
  }
})();
