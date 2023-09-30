import core from '@actions/core';
import github from '@actions/github';
import fetch from 'node-fetch';

const webhook_url = core.getInput('webhook_url');
const color = core.getInput('color');
const author_icon_url = core.getInput('author_icon_url');

let release = github.context.payload.release

let message = {
    username: 'Natro Macro',
    content: '@everyone',
    embeds: [{
        color: color,
        author: {
            name: 'New Natro Macro Release!',
            icon_url: author_icon_url
        },
        title: release.name,
        url: 'https://github.com/NatroTeam/NatroMacro',
        fields: [
            {
                name: '<:github:1157673461997641808>  GitHub Repo',
                value: '[Click here](https://github.com/NatroTeam/NatroMacro)'
            },
            {
                name: '<:patch_notes:1157673458172440696>  Patch Notes & Download',
                value: `[Click here](${release.html_url})`
            },
            {
                name: '<:download:1157673459602702357>  Direct Download',
                value: ('assets' in release && release.assets.length > 0) ? `[Click here](${release.assets[0].browser_download_url})` : `[Click here](${release.zipball_url})`
            }
        ],
        timestamp: release.published_at
    }]
}

fetch(`${webhook_url}?wait=true`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(message)
})
    .then(response => response.text())
    .then(text => {core.info(text)})
    .catch(err => {core.setFailed(err.message)})