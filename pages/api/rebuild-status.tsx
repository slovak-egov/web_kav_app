import { NextApiRequest, NextApiResponse } from 'next';
import { getRebuildStatus } from 'utils/utils';
import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./public/localStorage/build_data');

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const secret = request.query.secret;

  // Validate secret.
  if (secret !== process.env.NEXT_REBUILD_SECRET) {
    return response.status(401).json({ message: 'Invalid secret.' });
  }

  return response.status(200).json({ rebuild_status: getRebuildStatus(localStorage) });
}
