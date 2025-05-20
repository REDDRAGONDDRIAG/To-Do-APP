import { googleApiConfig } from './Config.js';

let gapiInited = false;
let gisInited = false;
let tokenClient;

export function initializeGoogleCalendar() {
    // Load the Google API client library
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
        gapi.load('client', initializeGapiClient);
    };
    document.head.appendChild(gapiScript);

    // Load the Google Identity Services library
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
        gisInited = true;
        maybeEnableButtons();
    };
    document.head.appendChild(gisScript);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: googleApiConfig.apiKey,
        discoveryDocs: googleApiConfig.discoveryDocs,
    });
    gapiInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: googleApiConfig.clientId,
            scope: googleApiConfig.scope,
            callback: '', // defined at request time
        });
    }
}

export async function addEventToCalendar(task) {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                reject(resp);
                return;
            }
            
            try {
                // Format the date without time (YYYY-MM-DD)
                const eventDate = new Date(task.dueDate).toISOString().split('T')[0];

                const event = {
                    'summary': task.text,
                    'description': `Priority: P${task.priority}`,
                    'start': {
                        'date': eventDate,
                        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                    },
                    'end': {
                        'date': eventDate,
                        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                    },
                    'reminders': {
                        'useDefault': false,
                        'overrides': [
                            {'method': 'popup', 'minutes': 24 * 60} // 24 hours before
                        ]
                    }
                };

                const request = gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                });

                const response = await request;
                console.log('All-day event created:', response);
                resolve(response);
            } catch (err) {
                console.error('Error creating all-day event:', err);
                reject(err);
            }
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            tokenClient.requestAccessToken({prompt: ''});
        }
    });
}

// Initialize when loaded
initializeGoogleCalendar();