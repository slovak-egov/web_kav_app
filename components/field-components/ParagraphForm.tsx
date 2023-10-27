import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import useLoading from 'utils/useLoading';
import { LoadingPage } from 'components/layout';
import {
  Input,
  PrimaryButton,
  TextField,
  Checkbox,
  Loader,
  Snackbar
} from '@eslovensko/idsk-react';
import * as yup from 'yup';
import { useReCaptcha } from 'next-recaptcha-v3';

function ParagraphForm(props) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { field_sent_email, field_form_type } = props;
  const { loading } = useLoading();
  const { t } = useTranslation('common');
  const { executeRecaptcha } = useReCaptcha();

  async function handleSubmit(values: any) {
    if (!executeRecaptcha) {
      return;
    }
    const sender = field_sent_email;
    const type = field_form_type;
    try {
      const token = await executeRecaptcha();
      if (!token) {
        formik.setStatus(t('forms.email_failed'));
        return;
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...values, sender, type })
      });

      if (response.ok) {
        formik.setSubmitting(false);
        formik.resetForm();
        formik.setStatus(t('forms.email_sent'));
      } else {
        formik.setSubmitting(false);
        formik.setStatus(t('forms.email_failed'));
      }
    } catch (error) {
      formik.setSubmitting(false);
      formik.setStatus(t('forms.email_failed'));
    }
  }

  const initialValues = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    organization: '',
    interestArea: '',
    request: '',
    role: '',
    agreed: false
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object({
      name: yup.string().trim().required(t('forms.name_required')),
      surname: yup.string().trim().required(t('forms.surname_required')),
      email: yup
        .string()
        .trim()
        .email(t('forms.invalid_email'))
        .required(t('forms.email_required')),
      phoneNumber: yup
        .string()
        .matches(/^(\+?421)?[0-9]{9}$/, t('forms.invalid_phone'))
        .required(t('forms.phone_required')),
      organization: yup.string().trim().required(t('forms.organization_required')),
      role:
        field_form_type === '0'
          ? yup.string()
          : yup.string().trim().required(t('forms.role_required')),
      interestArea: yup.string().trim().required(t('forms.interestArea_required')),
      request: yup.string().trim().required(t('forms.request_required')),
      agreed: yup.boolean().oneOf([true], t('forms.agree_required'))
    })
  });

  return (
    <>
      {!loading ? (
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="w-100">
              <Input
                name={'name'}
                value={formik.values.name}
                fullWidth
                id={'name'}
                aria-errormessage="custom-search-input"
                className="md:w-auto"
                type={'text'}
                placeholder={t('forms.name')}
                label={
                  <label className="" htmlFor={'name'}>
                    {t('forms.name')}:{'*'}
                  </label>
                }
                error={!!formik.errors['name']}
                errorMsg={formik.errors['name']}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="mt-4">
                <Input
                  name={'surname'}
                  value={formik.values.surname}
                  fullWidth
                  id={'surname'}
                  aria-errormessage="custom-search-input"
                  className="md:w-auto"
                  type={'text'}
                  placeholder={t('forms.surname')}
                  label={
                    <label className="" htmlFor={'surname'}>
                      {t('forms.surname')}:{'*'}
                    </label>
                  }
                  error={!!formik.errors['surname']}
                  errorMsg={formik.errors['surname']}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="mt-4">
                <Input
                  name={'email'}
                  value={formik.values.email}
                  fullWidth
                  id={'email'}
                  aria-errormessage="custom-search-input"
                  className="md:w-auto"
                  type={'email'}
                  placeholder={t('forms.email')}
                  label={
                    <label className="" htmlFor={'email'}>
                      {t('forms.email')}:{'*'}
                    </label>
                  }
                  error={!!formik.errors['email']}
                  errorMsg={formik.errors['email']}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="mt-4">
                <Input
                  name={'phoneNumber'}
                  value={formik.values.phoneNumber}
                  fullWidth
                  id={'phoneNumber'}
                  aria-errormessage="custom-search-input"
                  className="md:w-auto"
                  type={'tel'}
                  placeholder={t('forms.phone_number')}
                  label={
                    <label className="" htmlFor={'phoneNumber'}>
                      {t('forms.phone_number')}:{'*'}
                    </label>
                  }
                  error={!!formik.errors['phoneNumber']}
                  errorMsg={formik.errors['phoneNumber']}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="mt-4">
                <Input
                  name={'organization'}
                  fullWidth
                  value={formik.values.organization}
                  id={'organization'}
                  aria-errormessage="custom-search-input"
                  className="md:w-auto"
                  type={'text'}
                  placeholder={t('forms.organization')}
                  label={
                    <label className="" htmlFor={'organization'}>
                      {t('forms.organization')}:{'*'}
                    </label>
                  }
                  error={!!formik.errors['organization']}
                  errorMsg={formik.errors['organization']}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {field_form_type === '1' && (
                <div className="mt-4">
                  <Input
                    name={'role'}
                    fullWidth
                    id={'role'}
                    value={formik.values.role}
                    aria-errormessage="custom-search-input"
                    className="md:w-auto"
                    type={'text'}
                    placeholder={t('forms.role')}
                    label={t('forms.role') + '*'}
                    error={!!formik.errors['role']}
                    errorMsg={formik.errors['role']}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              )}
              <div className="mt-4">
                <Input
                  name={'interestArea'}
                  fullWidth
                  value={formik.values.interestArea}
                  id={'interestArea'}
                  aria-errormessage="custom-search-input"
                  className="md:w-auto"
                  type={'text'}
                  placeholder={t('forms.interest_area')}
                  label={
                    <label className="" htmlFor={'interestArea'}>
                      {t('forms.interest_area')}:{'*'}
                    </label>
                  }
                  error={!!formik.errors['interestArea']}
                  errorMsg={formik.errors['interestArea']}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="mt-4">
                <TextField
                  name={'request'}
                  fullWidth
                  id={'request'}
                  value={formik.values.request}
                  aria-errormessage="custom-search-input"
                  className="md:w-auto"
                  placeholder={t('forms.request_text')}
                  label={'' + t('forms.request_text') + '*'}
                  error={!!formik.errors['request']}
                  errorMsg={formik.errors['request']}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="mt-4">
                <Checkbox
                  name="agreed"
                  checked={formik.values.agreed}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label={t('forms.agree')}
                  error={!!formik.errors['agreed']}
                />
                {formik.touched.agreed && formik.errors.agreed && (
                  <div className="idsk-input__caption--error">{formik.errors.agreed}</div>
                )}
              </div>
              <div className="mt-4">
                <PrimaryButton fullWidth type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? <Loader spinnerClassName="h-6" /> : t('forms.submit')}
                </PrimaryButton>
              </div>
            </div>
          </form>
          {formik.status && (
            <Snackbar
              message={formik.status}
              open={!!formik.status}
              closeButton={true}
              onClose={() => {
                formik.setStatus('');
              }}
              variant="success"
            />
          )}
        </div>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

export default ParagraphForm;
