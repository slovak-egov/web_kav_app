import AuditLogs from '@skit-audit-log/react';
import { getVersion } from './version';
import { getCorrelationId } from './auth/session';
import { getActorFromUser, getUser } from '@skit-saml-auth/react';

export const auditLogs = AuditLogs({
  applicationId: process.env.APPLICATION_ID ?? '',
  applicationVersion: getVersion(),
  apiUrl: '',
  username: '',
  password: ''
});

export const initAuditLogs = async (req, res) => {
  const correlationId = await getCorrelationId(req, res);
  auditLogs.setCorrelationId(correlationId);
  auditLogs.setClientIP(req.headers['x-forwarded-for'] || req.socket.remoteAddress);

  const user = getUser({ req, res });

  if (!!user) {
    auditLogs.setDefaultActor(getActorFromUser(user));
  }

  return auditLogs;
};

interface HandleServerErrorToLogOpts {
  customMessage?: string;
  customAuditLogs?: any;
}
export const handleServerErrorToLog = (error, options: HandleServerErrorToLogOpts = {}) => {
  const localAuditLogs = options.customAuditLogs ?? auditLogs;

  const log = localAuditLogs.createLog(`API_REQUEST_ERROR`, options.customMessage ?? '');
  log.setFail();
  log.setMetadata({
    HTTP_CODE: error?.response?.status ?? '',
    MSG: error?.response?.data ?? '',
    FULL_AXIOS_ERROR: error
  });
  console.error(log.getData());
};
