import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceData } from 'utils/api-services';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const serviceId = request.query.sid;

  if (!!serviceId) {
    const serviceData = await getServiceData(serviceId.toString());

    if (!!serviceData) {
      response.status(200).json(serviceData);
    } else {
      return response.status(500);
    }
  } else {
    return response.status(400).json({ message: 'Service Id is empty' });
  }
}
