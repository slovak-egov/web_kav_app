import axios from 'axios';
import { getBaseUrl } from './utils';
import { httpsAgent } from './api';
import { handleServerErrorToLog } from './logs';
import { getDefaultHeaders } from './headers';

export interface GetServiceResponse {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  validFrom: string;
  validThru: string;
  isActive: boolean;
  configurationItemId: string;
  isAttachmentAllowed: boolean;
  isAuthentificationNeeded: boolean;
  isAutogenerateServiceUrlAllowed: boolean;
  isBulkAttachmentSignAllowed: boolean;
  isMixedSignAllowed: boolean;
  isMultipleRecipientsAllowed: boolean;
  isNativeAppSupported: boolean;
  isPaymentRequired: boolean;
  isPhysicalDocumentRequired: boolean;
  isPostTerminationSendingAllowed: boolean;
  isReauthenticationRequired: boolean;
  isResponsiveModeSupported: boolean;
  isServiceInstance: boolean;
  isSignatureNeeded: boolean;
  isSignedAttachmentRequired: boolean;
  paymentTypeId: string;
  paymentTypeName: string;
  serviceCategoryId: string;
  serviceCategoryName: string;
  serviceInfoUrl: string;
  serviceTypeId: string;
  serviceTypeName: string;
  serviceUrl: string;
  skTalkClassId: string;
  skTalkClassName: string;
  language: string;
  name: string;
  description: string;
}

export const getServiceLocatorData = async (
  serviceId: string
): Promise<GetServiceResponse | null> => {
  const url = `${getBaseUrl(
    'EGOV-SERVICE-LOCATOR'
  )}/v1/egov-service-locator/egov-services/${serviceId}`;
  try {
    const apiResponse = await axios.get(url, {
      headers: getDefaultHeaders(),
      httpsAgent: httpsAgent
    });

    return apiResponse.data;
  } catch (error: any) {
    handleServerErrorToLog(error, { customMessage: `EGOV-SERVICE-LOCATOR ${url}` });
    return null;
  }
};

export interface ServiceInstancesListItem {
  isSignatureNeeded: boolean;
  isAuthentificationNeeded: boolean;
  serviceUrl: string;
}

export interface GetServiceInstancesResponse {
  items: ServiceInstancesListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ServiceProvidersListItem {
  partnerId: string;
  corporateBodyId: string;
  corporateBodyName: string;
  municipalityName: string;
  eGovServiceId: string;
  partnerFullName: string;
  upvsPartnerUri: string;
}

export interface GetServiceProvidersResponse {
  items: ServiceProvidersListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const getServiceLocatorRelatedData = async (
  serviceId: string,
  type: string,
  query?: string
): Promise<GetServiceInstancesResponse | GetServiceProvidersResponse | null> => {
  let url = `${getBaseUrl(
    'EGOV-SERVICE-LOCATOR'
  )}/v1/egov-service-locator/egov-services/${serviceId}`;

  if (type === 'providers') {
    url = `${url}/${type}`;
  } else {
    url = `${url}/egov-service-${type}`;
  }

  if (!!query) {
    url = `${url}?${query}`;
  }

  try {
    const apiResponse = await axios.get(url, {
      headers: getDefaultHeaders(),
      httpsAgent: httpsAgent
    });

    return apiResponse?.data;
  } catch (error: any) {
    handleServerErrorToLog(error, { customMessage: `EGOV-SERVICE-LOCATOR ${url}` });
    return null;
  }
};

export const getServiceData = async (serviceId: string): Promise<GetServiceResponse | null> => {
  const url = `${getBaseUrl('EGOV-SERVICE')}/v1/egov-service/egov-services/${serviceId}`;
  try {
    const apiResponse = await axios.get(url, {
      headers: getDefaultHeaders(),
      httpsAgent: httpsAgent
    });

    return apiResponse.data;
  } catch (error: any) {
    handleServerErrorToLog(error, { customMessage: `EGOV-SERVICE ${url}` });
    return null;
  }
};
