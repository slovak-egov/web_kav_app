import { v4 as uuidv4 } from 'uuid';

export function getDefaultHeaders() {
  return {
    'Accept-Language': 'sk',
    correlationId: uuidv4(),
    'X-APP-ID': `${process.env.APPLICATION_ID}`,
    'X-APP-VERSION': '1.0.0',
    'X-APP-PLATFORM': 'web',
    'X-CAMP-PP-AUTH-TYPE': 'CAMP_PP_AUTH_EXT',
    'X-CAMP-APP-AUTH-TYPE': 'CAMP_APP_AUTH_MTLS',
    'X-CAMP-APP-AUTH': 'CAMP_APP_AUTH_OAUTH'
  };
}
