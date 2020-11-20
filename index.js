const core = require('@actions/core');
const { Client } = require('@elastic/elasticsearch');

const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const apiKey = core.getInput('api-key');
    const username = core.getInput('username');
    const password = core.getInput('password');

    if (!apiKey && !username && !password) {
      throw new Error("Either 'api-key' or 'username' and 'password' must be provided");
    }

    const endpoint = core.getInput('endpoint');
    const file = core.getInput('file');
    const index = core.getInput('index');

    const auth = {};

    if (apiKey) {
      auth.apiKey = apiKey;
    } else {
      auth.username = username;
      auth.password = password;
    }

    const client = new Client({
      node: endpoint,
      auth,
    });

    const body = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file)));

    const now = new Date();
    body.timestamp = now.toISOString();

    core.debug('got body...');
    core.debug(body);

    try {
      await client.index({
        index,
        body,
      });
    } catch (e) {
      core.debug(error);
    }

  } catch (error) {
    core.debug(error);
    core.setFailed(error.message);
  }
})()
