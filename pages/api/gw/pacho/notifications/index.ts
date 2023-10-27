import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleServerErrorToLog } from 'utils/logs';
import { httpsAgent } from 'utils/api';
import { getBaseUrl } from 'utils/utils';
import { getVersion } from 'utils/version';
import { getAccessToken, getUser } from '@skit-saml-auth/react';
import { getCorrelationId } from 'utils/auth/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUser({ req, res });

  if (!user) {
    return res.status(400).json({ message: 'no user' });
  }

  const idType = user?.isRepresented ? 'ICO' : 'PCO';
  const idValue = user?.isRepresented
    ? user?.attributes['Subject.ICO']
    : user?.attributes['Subject.PCO'];

  if (req.method === 'GET') {
    const applicationId = process.env.APPLICATION_ID;
    const baseURL = getBaseUrl('PACHO');
    const correlationId = await getCorrelationId(req, res);

    try {
      const lang = req.headers?.['accept-language'] ?? 'sk';
      const token = getAccessToken({ req, res });

      const apiResponse = await axios.get(
        `${baseURL}/v1/applications/${applicationId}/pacho/ms/recipients/${idType}/${idValue}/notifications?pageSize=30&locale=${lang}&sort=createdAt:`,
        {
          headers: {
            'Accept-Language': lang,
            'X-PLATFORMID': 'ANDROID',
            'X-VERSION': getVersion(),
            'X-DEVICEID': '5bc6a3ea-3c31-41de-9dcd-76d465ee4824',
            Authorization: `Bearer ${token}`,
            'X-APP-ID': `${process.env.APPLICATION_ID}`,
            'X-APP-VERSION': '1.0.0',
            'X-APP-PLATFORM': `web`,
            'X-CAMP-PP-AUTH-TYPE': 'CAMP_PP_AUTH_INT',
            'X-CAMP-APP-AUTH-TYPE': 'CAMP_APP_AUTH_MTLS',
            'X-CAMP-APP-AUTH': 'Bearer 456789OIUZTFGHJK987654567ZGHJ',
            correlationId
          },
          httpsAgent: httpsAgent
        }
      );
      res.status(200).json(apiResponse.data);
    } catch (error: any) {
      handleServerErrorToLog(error, { customMessage: `PACHO` });
      res.status(error?.response?.status ?? 503).json({ message: 'failed to load template' });
    }
  } else {
    res.status(405).send('http method not allowed');
  }
}
