import * as React from 'react';

interface Contact {
  id: string;
  primary: boolean;
  type: string;
  value: string;
}

export enum ContactType {
  MobilePhone = '1',
  Phone = '2',
  Fax = '3',
  Email = '4',
  Facebook = '5',
  Instagram = '6',
  ContactUrl = '7',
  WebsiteUrl = '8',
  Skype = '9',
  ContactPerson = '10'
}

export const getPrimaryContacts = (organizationUnitNode): Contact[] => {
  const contacts: any[] = organizationUnitNode?.contact ?? [];
  return contacts
    .filter((contact) => contact.primary)
    .map((contact) => {
      return {
        id: contact.id,
        primary: contact.primary,
        type: contact.type_id?.resourceIdObjMeta?.drupal_internal__target_id,
        value: contact.contact_text
      };
    });
};

interface OrganizationContactProps {
  contact: Contact;
  className?: string;
}

export default function OrganizationContact({ contact, className }: OrganizationContactProps) {
  switch (contact.type) {
    case ContactType.WebsiteUrl:
      return (
        <a className={className} href={contact.value} target="_blank" rel="noopener">
          {contact.value}
        </a>
      );
    default:
      return <span className={className}>{contact.value}</span>;
  }
}
