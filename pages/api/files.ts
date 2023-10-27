import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleServerErrorToLog } from 'utils/logs';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const fileUrl = request.query?.url as string;

  if (!!fileUrl) {
    const { hostname } = new URL(fileUrl);
    if (hostname !== process.env.NEXT_MEDIA_DOMAIN) {
      response.status(400).send('url parameter invalid');
      return;
    }

    const filename = fileUrl.split('/').at(-1);
    try {
      const axiosResp = await axios.get(fileUrl, {
        responseType: 'stream'
      });
      response.setHeader('Content-Type', axiosResp.headers['content-type']);
      response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      axiosResp.data.pipe(response);
    } catch (error: any) {
      handleServerErrorToLog(error, { customMessage: `ATTACHMENTS ${fileUrl}` });
      response.status(error?.response?.status ?? 503).json({ message: 'download failed' });
    }
  } else {
    response.status(400).send('url parameter missing');
  }
}
