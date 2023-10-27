import getConfig from 'next/config';

export const getVersion = () => {
  return !!process.env.DOCKER_BUILD_VERSION
    ? process.env.DOCKER_BUILD_VERSION
    : String(getConfig()?.version ?? '');
};
