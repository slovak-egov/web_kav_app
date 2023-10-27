import { NextApiRequest, NextApiResponse } from 'next';
import { validateRecaptcha } from '@skit-feedback/feedback-form/dist/backend';

import { drupal } from 'utils/drupal';
import { handleServerErrorToLog } from 'utils/logs';
import { axiosProxyOptions } from 'utils/backend';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method === 'POST') {
      const reCaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
      if (!reCaptchaSecret) {
        response.status(500).json({ message: 'missing recaptcha secret' });
        return;
      }

      const reCaptcha = await validateRecaptcha(reCaptchaSecret, request.body, axiosProxyOptions);
      if (!reCaptcha) {
        response.status(429).json({ message: 'invalid captcha token' });
        return;
      }

      const result = await drupal.createResource(
        'comment--comment',
        {
          data: {
            type: 'comment--comment',
            attributes: {
              name: request.body.name,
              subject: `komentar od ${request.body.name}`,
              field_hostname: request.body.host,
              comment_body: {
                value: request.body.message,
                format: 'plain_text'
              },
              entity_type: 'node',
              field_name: 'comment'
            },
            relationships: {
              entity_id: {
                data: {
                  type: `node--${request.body.data.type}`,
                  id: request.body.data.id
                }
              }
            }
          }
        },
        {
          withAuth: false
        }
      );

      if (!result) {
        throw Error('Error occured');
      }

      response.status(200).end();
    }
  } catch (error: any) {
    if (error.statusCode == 422) {
      response.status(422).json('comment.ip.blocked');
    } else {
      handleServerErrorToLog(error);
      response.status(error?.statusCode ?? 500).json({ message: 'Error while fetching CMS.' });
    }
  }
}
