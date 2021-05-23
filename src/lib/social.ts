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
            
                break;
        case "google":
    
            break;
    
        default:
            break;
    }
}