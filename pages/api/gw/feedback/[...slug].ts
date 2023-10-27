import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleServerErrorToLog } from 'utils/logs';
import { httpsAgent } from 'utils/api';
import { getBaseUrl } from 'utils/utils';
import { generateHeaders } from '@skit-feedback/feedback-form/dist/utils';
import { validateRecaptcha } from '@skit-feedback/feedback-form/dist/backend';
import { axiosProxyOptions } from 'utils/backend';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const buildUrl = (uri) => `${getBaseUrl('FEEDBACK')}${uri}`;

  if (request.method === 'GET' && !!request?.url) {
    const uri = request.url?.replace('/api/gw/feedback', '');
    try {
      const lang = request.headers?.['accept-language'] ?? 'sk';
      const apiResponse = await axios.get(buildUrl(uri), {
        headers: {
          ...generateHeaders(lang),
          'X-CAMP-PP-AUTH-TYPE': 'CAMP_PP_AUTH_EXT'
        },
        httpsAgent: httpsAgent
      });
      response.status(200).json(apiResponse.data);
    } catch (error: any) {
      handleServerErrorToLog(error, { customMessage: `FEEDBACK ${uri}` });
      response.status(error?.response?.status ?? 503).json({ message: 'failed to load template' });
    }
  } else if (request.method === 'POST' && !!request?.url) {
    const reCaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!reCaptchaSecret) {
      response.status(500).json({ message: 'missing recaptcha secret' });
      return;
    }

    const reCaptcha = await validateRecaptcha(reCaptchaSecret, request.body, axiosProxyOptions);
    if (!reCaptcha) {
      response.status(429).json({ message: 'invalid captcha token' });
      return;
    }

    const uri = request.url?.replace('/api/gw/feedback', '');
    try {
      await axios.post(buildUrl(uri), request.body, {
        headers: {
          ...generateHeaders(request.headers?.['accept-language'] ?? 'sk'),
          'X-CAMP-PP-AUTH-TYPE': 'CAMP_PP_AUTH_EXT'
        },
        httpsAgent: httpsAgent
      });
      response.status(200).json({ message: 'data successfully submitted' });
    } catch (error: any) {
      handleServerErrorToLog(error, { customMessage: `FEEDBACK ${uri}` });
      response.status(error?.response?.status ?? 503).json({ message: 'failed to submit data' });
    }
  } else {
    response.status(405).send('http method not allowed');
  }
}
