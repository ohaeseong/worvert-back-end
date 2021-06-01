import config from '../../config';
import { google } from 'googleapis';


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
            console.log(redirectUri);
            
            const oauth2Client = new google.auth.OAuth2('812566867088-f0jjr3olrjm1b5d6805phprone5luq0r.apps.googleusercontent.com', 'TXH3PmLc8zNW92Ql2Byhi9VP', redirectUri);
            
            const url = oauth2Client.generateAuthUrl({
              scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
              ],
            //   state: JSON.stringify({ next })
            });
            
            
            return url;
        default:
            break;
    }
}