import config from '../../config';


export function onLoginWithSocialService(social: string, redirectUri: string) {

    switch (social) {
        case "github":
            const GIT_HUB_LOGIN_URL = 'https://github.com/login/oauth/authorize?';
            const CLIENT_ID = config.githubAppId;
            const REDIRECT_URI = redirectUri;

            const requestURI = `${GIT_HUB_LOGIN_URL}client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
            return requestURI;
        case "facebook":
            // const state = JSON.stringify({ next });
            const callbackUri = redirectUri;
            const FACEBOOK_ID = config.facebookAppId;
            return `https://www.facebook.com/v11.0/dialog/oauth?client_id=${FACEBOOK_ID}&redirect_uri=${callbackUri}&scope=email,public_profile`;
        case "google":
    
            break;
    
        default:
            break;
    }
}