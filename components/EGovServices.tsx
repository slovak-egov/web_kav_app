import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { handleClientErrorToLog } from 'utils/utils';
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import ExpandMoreIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Navigation/expand_more.svg';
import ExpandLessIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Navigation/expand_less.svg';
import { getServiceProviders } from 'utils/services';
import { ServiceProvidersListItem } from 'utils/api-services';
import { Input } from '@eslovensko/idsk-react';

export function ServiceProviderSelect(props) {
  const { t } = useTranslation('common');
  const [isOpened, setIsOpened] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsOpened((p) => !p);
    }
  };

  return (
    <Autocomplete
      {...props}
      open={isOpened}
      onOpen={() => setIsOpened(true)}
      onClose={() => setIsOpened(false)}
      onChange={(event: any, newValue: any) => {
        props.onChange(event, newValue);
      }}
      onKeyDown={handleKeyDown}
      autoHighlight
      getOptionLabel={(option: ServiceProvidersListItem) => {
        return option.partnerFullName;
      }}
      isOptionEqualToValue={(option: ServiceProvidersListItem, value: ServiceProvidersListItem) => {
        return option.partnerId === value.partnerId;
      }}
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <Input
            {...params.inputProps}
            fullWidth
            iconPosition="right"
            icon={
              isOpened ? <ExpandLessIcon className="h-6" /> : <ExpandMoreIcon className="h-6" />
            }
            placeholder={t('service.select_service_provider')}
            aria-expanded={isOpened}
          />
        </div>
      )}
      noOptionsText={t('service.select_service_provider.no_options')}
    />
  );
}

export default function EGovServices({ serviceId, handleSelectServiceProvider, serviceProviders }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [eGovResults, setEGovResults] = useState<{ [key: string]: any }[]>(serviceProviders ?? []);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let wasUnmounted = false;
    const fetchServices = async (newInputValue) => {
      try {
        const filter = {
          name: newInputValue
        };

        const serviceProvidersData = await getServiceProviders({ serviceId, filter });
        if (!wasUnmounted) {
          setEGovResults(serviceProvidersData.items);
        }
      } catch (e) {
        handleClientErrorToLog(e);
      }
    };

    if (inputValue.length > 3 || inputValue === '') {
      fetchServices(inputValue);
    }
    return () => {
      wasUnmounted = true;
    };
  }, [router, inputValue, serviceId]);

  return (
    <div>
      <div className="p-text idsk-text-body pb-5" data-service={serviceId}>
        {t('service.select_service_provider_desc')}
      </div>
      <ServiceProviderSelect
        id="service-provider-select"
        onChange={(event: any, newValue: any | null) => {
          handleSelectServiceProvider(
            newValue?.partnerId ?? null,
            newValue?.eGovServiceInstanceId ?? null
          );
        }}
        options={eGovResults}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
      />
    </div>
  );
}
