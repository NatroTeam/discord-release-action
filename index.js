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
}

fetch(`${webhook_url}?wait=true`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(message)
})
    .then(response => response.text())
    .then(text => {core.info(text)})
    .catch(err => {core.setFailed(err.message)})
