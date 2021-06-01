import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

export function onLoginWithSocialService(social: string, redirectUri: string) {

    switch (social) {
        case "github":
            const GIT_HUB_LOGIN_URL = 'https://github.com/login/oauth/authorize?';
            const REDIRECT_URI = redirectUri;

            const requestURI = `${GIT_HUB_LOGIN_URL}client_id=${process.env.GIT_HUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
            return requestURI;
        case "facebook":
            // const state = JSON.stringify({ next });
            const callbackUri = redirectUri;
            return `https://www.facebook.com/v11.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${callbackUri}&scope=email,public_profile`;
        case "google":
            const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
            
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