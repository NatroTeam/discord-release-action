import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

const token = core.getInput('token');
const channel = core.getInput('channel');
const color = core.getInput('color');
const author = core.getInput('author');
const baseURL = 'https://discord.com/api/v10';

const release = github.context.payload.release;

const message = {
    content: '@everyone',
    embeds: [{
        color: color,
        author: {
            name: 'New Natro Macro Release!',
            icon_url: author
        },
        title: release.name,
        url: release.html_url,
        fields: [
            {
                name: '<:github:1157673461997641808>  GitHub Repo',
                value: '[View (give us a <a:staricon:1163633093794615406>!)](https://github.com/NatroTeam/NatroMacro)'
            },
            {
                name: '<:patch_notes:1157673458172440696>  Patch Notes & Changes',
                value: `[See what's new](${release.html_url})`
            },
            {
                name: '<:download:1157673459602702357>  Direct Download',
                value: ('assets' in release && release.assets.length > 0) ? `[Click here to download](${release.assets[0].browser_download_url})` : `[Click here to download](${release.zipball_url})`
            }
        ],
        timestamp: release.published_at
    }]
};

const headers = {'Authorization': `Bot ${token}`, 'Content-Type': 'application/json'};

fetch(`${baseURL}/channels/${channel}/messages`, {method: 'POST', body: JSON.stringify(message), headers: headers})
    .then(response => response.json())
    .then(message => {core.info(JSON.stringify(message)); return fetch(`${baseURL}/channels/${channel}/messages/${message.id}/crosspost`, {method: 'POST', headers: headers})})
    .then(response => response.text())
    .then(text => {core.info(text)})
    .catch(err => {core.setFailed(err.message)});
