import nextSession from 'next-session';
import { v4 as uuidv4 } from 'uuid';

export const getSession = nextSession();

export const destroySession = async (req, res) => {
  const session = await getSession(req, res);

  if (session && session.destroy) {
    await session.destroy();
  }
};

export const getCorrelationId = async (req, res) => {
  const session = await getSession(req, res);

  if (!session.correlationId) {
    session.correlationId = uuidv4();
    await session.commit();
  }

  return session.correlationId;
};
