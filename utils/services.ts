import * as queryString from 'query-string';
import axios from 'axios';
import {
  GetServiceInstancesResponse,
  GetServiceProvidersResponse,
  GetServiceResponse
} from './api-services';
import { getDefaultHeaders } from './headers';

export interface ServiceInstancesFilter {
  partnerId?: string;
}

export interface ServiceProvidersFilter {
  name?: string;
}

export interface GeServiceProvidersProps {
  serviceId: string;
  filter?: ServiceProvidersFilter;
}

export const getServiceData = async (serviceId): Promise<GetServiceResponse> => {
  const response = await axios.get(`/api/gw/egov/${serviceId}`, {
    headers: getDefaultHeaders()
  });
  return response.data;
};

export const getServiceProviders = async ({
  serviceId,
  filter = {
    name: ''
  }
}: GeServiceProvidersProps): Promise<GetServiceProvidersResponse> => {
  let url = `/api/gw/egov-locator/${serviceId}/providers`;

  if (!!filter.name) {
    const query = queryString.stringify({
      filter: `partnerFullName=like="%${filter.name}%"`
    });

    url = `${url}?${query}`;
  }

  const response = await axios.get(url, {
    headers: getDefaultHeaders()
  });

  return response.data;
};

export const getServiceInstances = async (
  serviceId: string,
  filter: ServiceInstancesFilter | null = null
): Promise<GetServiceInstancesResponse> => {
  let url = `/api/gw/egov-locator/${serviceId}/instances`;

  if (!!filter?.partnerId) {
    const query = queryString.stringify({
      filter: `partnerId=="${filter.partnerId}"`
    });

    url = `${url}?${query}`;
  }

  const response = await axios.get(url, {
    headers: getDefaultHeaders()
  });

  return response.data;
};
