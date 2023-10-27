import * as queryString from 'query-string';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceLocatorRelatedData } from 'utils/api-services';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const serviceId = request.query.sid;
  let type = request.query.type ?? '';

  if (Array.isArray(type)) {
    type = type.join('');
  }

  if (!!serviceId && ['providers', 'instances'].includes(type)) {
    let query;

    if (!!request.query.filter) {
      query = queryString.stringify({
        filter: request.query.filter
      });
    }

    const serviceData = await getServiceLocatorRelatedData(serviceId.toString(), type, query);

    if (serviceData && !!serviceData.items) {
      response.status(200).json(serviceData);
    } else {
      return response.status(500);
    }
  } else {
    return response.status(400).json({ message: 'Service Id is empty' });
  }
}
