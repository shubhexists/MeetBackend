const {RtcTokenBuilder, RtcRole} = require('agora-token');

const appID = process.env.APP_ID;
const appCertificate = process.env.APP_CERTIFICATE;
const channelName = 'shubhTesting';
const uid = 0;
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 3600
const currentTimestamp = Math.floor(Date.now() / 1000)
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
console.log("Token With Integer Number Uid: " + tokenA);