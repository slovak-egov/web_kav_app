import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const slug = request.query.slug;
  const secret = request.query.secret;

  // Validate secret.
  if (secret !== process.env.NEXT_REBUILD_SECRET) {
    return response.status(401).json({ message: 'Invalid secret.' });
  }

  // Validate slug.
  if (!slug) {
    return response.status(400).json({ message: 'Invalid slug.' });
  }

  try {
    await response.revalidate(slug.toString());

    return response.json({});
  } catch (error) {
    let message = error;
    if (error instanceof Error) {
      message = error.message;
    }
    return response.status(404).json({
      message: message
    });
  }
}
