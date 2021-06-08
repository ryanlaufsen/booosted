// Required modules
const { dialog } = require('@electron/remote');
const leagueConnect = require('league-connect');

// Custom utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Buttons
const boostButton = document.getElementById('boostButton');
boostButton.onclick = e => {
    // aramBoost();
    handleBoost();
}

// Display events
// options = {
//     message: 'League of Legends client is not running!',
//     type: 'error',
//     buttons: ['Okay.', 'Okay. I know I\'m a dumbass.'],
//     defaultId: 1,
//     title: 'Failed to BOOOST :(',
//     detail: 'You didn\'t open the client yet.',
//     // icon: 'todo'
// }

function handleClientNotFound() {
    // document.getElementById('messages').style.opacity = 1;
    // document.getElementById('messages').innerHTML = 'League of Legends <br> is not running';
    dialog.showErrorBox('Failed to BOOOST :(','League of Legends client is not running!');
    // dialog.showMessageBox(options);
}

function handleNotAram() {
    dialog.showErrorBox('Failed to BOOOST :(','Not in ARAM game!');
}

async function handleBoost() {
    // document.getElementById('messages').style.opacity = 1;
    // document.getElementById('messages').style.fontWeight = 700;
    // document.getElementById('messages').style.fontSize = '80px';
    // document.getElementById('messages').style.color = 'var(--clr-neon)';
    // document.getElementById('messages').innerHTML = 'BBBOOOSTED';

    document.getElementById('boostText').style.opacity = 0;
    await sleep(200);
    // document.getElementById('boostText').style.fontSize = '9.4vw';
    document.getElementById('boostText').innerText = 'BOOOSTED';
    await sleep(300);
    document.getElementById('boostText').style.opacity = 1;

    await sleep(5000);

    document.getElementById('boostText').style.opacity = 0;
    await sleep(200);
    document.getElementById('boostText').innerText = 'BOOOST';
    // document.getElementById('boostText').style.fontSize = '12.3vw';
    await sleep(300);
    document.getElementById('boostText').style.opacity = 1;
}

// LCU API
async function getCredentials() {
    try {
        credentials = await leagueConnect.authenticate()
        return credentials;
    } catch (e) {
        console.error(e);
        handleClientNotFound();
    }
}

async function checkAram() {
    try {
        const response = await leagueConnect.request({
            method: 'GET',
            url: 'lol-champ-select/v1/session'
        }, await getCredentials());
        responseJSON = await response.json();
        if (responseJSON.allowBattleBoost == true) {
            return true;
        } else {
            handleNotAram();
        };
    } catch (e) {
        console.error(e);
    }
}

async function aramBoost() {
    if (await checkAram()) {
        try {
            const response = await leagueConnect.request({
                method: 'POST',
                url: '/lol-login/v1/session/invoke?destination=lcdsServiceProxy&method=call&args=["","teambuilder-draft","activateBattleBoostV1",""]',
            }, await getCredentials());
            console.log("Response: " + response.statusText, response.status, "\nBOOOSTED");
            handleBoost();
        } catch (e) {
            console.error(e);
        }
    }
}