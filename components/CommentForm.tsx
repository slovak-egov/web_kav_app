import React from 'react';
import {
  InformationBanner,
  InformationBannerProps,
  Loader,
  PrimaryButton,
  TextField
} from '@eslovensko/idsk-react';
import AccountIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/account_circle.svg';
import CheckIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/check_circle.svg';
import WarningIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Alert/warning.svg';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ReactNode, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useReCaptcha } from 'next-recaptcha-v3';

export interface CommentFormProps {
  nodeData?: { [key: string]: string };
}

export default function CommentForm({ nodeData, ...props }: CommentFormProps) {
  const [message, setMessage] = useState<ReactNode>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const { t } = useTranslation('common');
  const refs = useRef([]);
  const { executeRecaptcha } = useReCaptcha();

  const [ipAddress, setIPAddress] = useState('');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => setIPAddress(data.ip))
      .catch(() => {});
  }, []);

  async function handleSubmit(values, { resetForm }) {
    setSending(true);
    if (!executeRecaptcha) {
      return;
    }
    try {
      const token = await executeRecaptcha();
      if (!token) {
        const banner = displayBanner({
          children: t('CAPTCHA.address.blocked'),
          variant: 'warning'
        });
        setMessage(banner);
        return;
      }

      const response = await axios.post('/api/comment', {
        name: values.name.length > 0 ? `${values.name}` : ipAddress,
        host: ipAddress,
        message: values.message,
        data: nodeData,
        token
      });
      if (response.status === 200) {
        const banner = displayBanner({
          children: t('comment.send'),
          variant: 'success'
        });
        setMessage(banner);
        resetForm();
      } else if (response.status === 422) {
        const banner = displayBanner({
          children: t('ip.address.blocked'),
          variant: 'warning'
        });
        setMessage(banner);
        resetForm();
      } else {
        const banner = displayBanner({
          children: t('comment.send_error'),
          variant: 'warning'
        });
        setMessage(banner);
      }
      setSubmitted(true);
      setSending(false);
    } catch (e) {
      const banner = displayBanner({
        children: t('comment.send_error'),
        variant: 'warning'
      });
      setMessage(banner);
      setSubmitted(true);
      setSending(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      message: '',
      name: ''
    },
    onSubmit: handleSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      message: yup.string().trim().required(t('comment.required_message'))
    })
  });

  const displayBanner = (data: {
    children: ReactNode;
    variant: InformationBannerProps['variant'];
  }) => {
    return (
      <InformationBanner
        className="mb-8"
        variant={data.variant}
        icon={
          data.variant === 'success' ? (
            <CheckIcon className="h-5" />
          ) : (
            <WarningIcon className="h-5" />
          )
        }
        closeButtonOnClick={() => {
          setSubmitted(false);
        }}
        closeButtonLabel={t('menu.close')}
        hideCloseButton={data.variant !== 'success'}
        role={data.variant === 'warning' ? 'alert' : 'status'}
        title={data.variant !== 'success' ? t('comment.summary_error') : ''}
        ariaLabel={data.variant === 'success' ? t('comment.send') : ''}
        errorMessageId="commnent-banner"
      >
        {data.children}
      </InformationBanner>
    );
  };

  return (
    <>
      <div className="comment-form border-t border-neutral-300 mt-6" {...props}>
        <h2 className="my-8">{t('comment.add')}</h2>
        <div hidden={!submitted}>{message}</div>
        <>
          {!!Object.entries(formik.errors).length &&
            displayBanner({
              children: Object.entries(formik.errors).map(([key, error]) => (
                <Link href={`#${key}`} key={key}>
                  <a
                    className="block w-full idsk-link-s"
                    onClick={(e) => {
                      e.preventDefault();
                      refs.current[key].focus();
                    }}
                  >
                    {error}
                  </a>
                </Link>
              )),
              variant: 'warning'
            })}
          <form className="flex" onSubmit={formik.handleSubmit}>
            <AccountIcon className="flex-none h-10 mt-2 mr-5" />
            <div className="flex-auto">
              <TextField
                rows={1}
                maxLength={40}
                ref={(el) => (refs.current['name'] = el)}
                fullWidth={true}
                placeholder={t('comment.placeholder_name')}
                name="name"
                id="name"
                label={t('comment.placeholder_name')}
                labelSrOnly={true}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.errors.name}
                errorMsg={formik.errors.name}
                errorMessageId="name-form-text"
              />
              <TextField
                ref={(el) => (refs.current['message'] = el)}
                fullWidth={true}
                placeholder={t('comment.placeholder_msg')}
                name="message"
                id="message"
                label={t('comment.placeholder_msg')}
                labelSrOnly={true}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.errors.message}
                errorMsg={formik.errors.message}
                errorMessageId="comment-form-text"
              />
              <PrimaryButton type="submit">
                {!sending ? t('comment.post') : <Loader spinnerClassName="h-6" />}
              </PrimaryButton>
            </div>
          </form>
        </>
      </div>
    </>
  );
}
