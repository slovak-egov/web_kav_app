import React from 'react';
import { DrupalNode } from 'next-drupal';
import { render } from '../testUtils';
import IndexPage, { MenuData, PathObject } from '../../pages/index';

describe('IndexPage', () => {
  it('matches snapshot', () => {
    const mockNode = {
      type: 'node--article',
      id: '222d13ee-a245-49c5-8db1-a862a1ec6a13',
      drupal_internal__nid: 1,
      drupal_internal__vid: 10,
      langcode: 'sk',
      revision_timestamp: '2022-06-30T13:11:31+00:00',
      revision_log: null,
      status: true,
      title: 'Hello world Hello world',
      created: '2022-06-30T13:08:26+00:00',
      changed: '2022-06-30T13:11:23+00:00',
      promote: false,
      sticky: false,
      default_langcode: true,
      revision_translation_affected: true,
      moderation_state: 'published',
      path: {
        alias: null,
        pid: null,
        langcode: 'sk'
      },
      content_translation_source: 'und',
      content_translation_outdated: false,
      comment: {
        status: 2,
        cid: 0,
        last_comment_timestamp: 1656594524,
        last_comment_name: null,
        last_comment_uid: 1,
        comment_count: 0
      },
      field_body: null,
      field_perex: {
        value: 'Lorem ipsum',
        format: 'plain_text',
        processed: '<p>Lorem ipsum</p>\n'
      },
      links: {
        self: {
          href: 'http://cms-slovensko-sk.lndo.site/jsonapi/node/article/222d13ee-a245-49c5-8db1-a862a1ec6a13?resourceVersion=id%3A10'
        }
      },
      node_type: null,
      revision_uid: null,
      uid: null,
      field_image: {
        links: {
          self: { href: 'https://rgw.slovenskoit.sk/svm.dev-cms/public/images/Logo_0.png' }
        }
      },
      field_tags: [],
      relationshipNames: ['node_type', 'revision_uid', 'uid', 'field_image']
    } as unknown as DrupalNode;
    const mockLayoutData = {
      type: 'config--general',
      id: 'de71f69c-0255-49ed-9ff2-00e83629fbaa',
      egovHeaderTriggerLink1: 'Oficiálna stránka',
      egovHeaderTriggerLink2: 'verejnej správy SR',
      egovHeaderTitle1: 'Doména gov.sk je oficálna',
      egovHeaderText1: {
        value:
          '<p>Toto je oficiálna webová stránka orgánu verejnej moci Slovenskej republiky. Oficiálne stránky využívajú najmä doménu gov.sk. <a href="https://www.slovensko.sk/sk/agendy/agenda/_organy-verejnej-moci">Odkazy na jednotlivé webové sídla orgánov verejnej moci nájdete na tomto odkaze.</a></p>\r\n',
        format: 'basic_html'
      },
      egovHeaderTitle2: 'Táto stránka je zabezpečená',
      egovHeaderText2: {
        value:
          '<p>Buďte pozorní a vždy sa uistite, že zdieľate informácie iba cez zabezpečenú webovú stránku verejnej správy SR. Zabezpečená stránka vždy začína https:// pred názvom domény webového sídla.</p>\r\n',
        format: 'basic_html'
      },
      headerLogo: 'https://rgw.slovenskoit.sk/svm.dev-cms/public/images/Logo_0.png',
      footerClaim: {
        value:
          '<p><span>Prevádzkovateľom služby je Ministerstvo investícií, regionálneho rozvoja a informatizácie SR.</span></p>\r\n\r\n<p><span>Vytvorené v súlade s Jednotným dizajn manuálom elektronických služieb.</span></p>\r\n',
        format: 'basic_html'
      },
      footerLogo: 'https://rgw.slovenskoit.sk/svm.dev-cms/public/images/Logo%281%29.png'
    } as unknown as DrupalNode;
    const mockMenuData = {
      header: [
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:c62ec868-1044-46e9-9ae9-66ebb1f7ee30',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'main',
          meta: {
            entity_id: '1'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: 'entity.node.canonical',
            parameters: {
              node: '1'
            }
          },
          title: 'Test',
          url: '/clanok-1',
          weight: '0'
        },
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:6afda2c4-d819-4bf8-b994-48bc7ae077cb',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'main',
          meta: {
            entity_id: '2'
          },
          options: {
            query: []
          },
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: 'entity.node.canonical',
            parameters: {
              node: '3'
            }
          },
          title: 'ZU',
          url: '/test-test',
          weight: '0'
        },
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:f29c78bb-2a22-47ed-9c51-426cf0853e81',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'main',
          meta: {
            entity_id: '3'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '<nolink>',
            parameters: []
          },
          title: 'Drop Down',
          url: '',
          weight: '1',
          items: [
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:b27fec8a-2323-4faf-8ed8-72b3ab216958',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'main',
              meta: {
                entity_id: '4'
              },
              options: {
                query: []
              },
              parent: 'menu_link_content:f29c78bb-2a22-47ed-9c51-426cf0853e81',
              provider: 'menu_link_content',
              route: {
                name: 'entity.node.canonical',
                parameters: {
                  node: '1'
                }
              },
              title: 'option 1',
              url: '/clanok-1',
              weight: '0'
            },
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:e6077154-31ef-43d0-a9e6-08ec58d1d1d4',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'main',
              meta: {
                entity_id: '5'
              },
              options: {
                query: []
              },
              parent: 'menu_link_content:f29c78bb-2a22-47ed-9c51-426cf0853e81',
              provider: 'menu_link_content',
              route: {
                name: 'entity.node.canonical',
                parameters: {
                  node: '1'
                }
              },
              title: 'option 2',
              url: '/clanok-1',
              weight: '0'
            }
          ]
        }
      ],
      footer: [
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:743679ca-f253-451d-aa8a-1b785262d6ec',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'footer',
          meta: {
            entity_id: '6'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '<nolink>',
            parameters: []
          },
          title: 'Informácie',
          url: '',
          weight: '0',
          items: [
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:df77d784-5770-4f9a-908e-327cc16d15d5',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'footer',
              meta: {
                entity_id: '9'
              },
              options: [],
              parent: 'menu_link_content:743679ca-f253-451d-aa8a-1b785262d6ec',
              provider: 'menu_link_content',
              route: {
                name: '',
                parameters: []
              },
              title: 'Informácie a návody',
              url: '/test',
              weight: '0'
            },
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:8f81570e-002d-4321-863d-9344c094cc0c',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'footer',
              meta: {
                entity_id: '10'
              },
              options: [],
              parent: 'menu_link_content:743679ca-f253-451d-aa8a-1b785262d6ec',
              provider: 'menu_link_content',
              route: {
                name: '',
                parameters: []
              },
              title: 'Pre občanov',
              url: '/test',
              weight: '0'
            }
          ]
        },
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:b9c44e8b-aaaf-427a-b9ef-19684c1a6582',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'footer',
          meta: {
            entity_id: '14'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '<nolink>',
            parameters: []
          },
          title: '&nbsp;',
          url: '',
          weight: '1',
          items: [
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:972c203b-1603-4af9-b3fa-6abbfa06ea55',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'footer',
              meta: {
                entity_id: '16'
              },
              options: [],
              parent: 'menu_link_content:b9c44e8b-aaaf-427a-b9ef-19684c1a6582',
              provider: 'menu_link_content',
              route: {
                name: '',
                parameters: []
              },
              title: 'Informácie a návody',
              url: '/test',
              weight: '0'
            },
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:6172700d-fd34-4a06-b9fc-59499b5c9c6a',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'footer',
              meta: {
                entity_id: '15'
              },
              options: [],
              parent: 'menu_link_content:b9c44e8b-aaaf-427a-b9ef-19684c1a6582',
              provider: 'menu_link_content',
              route: {
                name: '',
                parameters: []
              },
              title: 'Často kladené otázky',
              url: '/test',
              weight: '0'
            }
          ]
        },
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:34bf58dc-6229-44e3-a6c5-a3b95cd978d4',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'footer',
          meta: {
            entity_id: '8'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '<nolink>',
            parameters: []
          },
          title: 'Podpora',
          url: '',
          weight: '2',
          items: [
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:4941b4d0-b605-4871-8a4f-85cbb30f8fe0',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'footer',
              meta: {
                entity_id: '11'
              },
              options: [],
              parent: 'menu_link_content:34bf58dc-6229-44e3-a6c5-a3b95cd978d4',
              provider: 'menu_link_content',
              route: {
                name: '',
                parameters: []
              },
              title: 'Informácie a návody',
              url: '/test',
              weight: '0'
            },
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:e8e647ec-0b8b-4c9d-a17b-cf118b5472db',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'footer',
              meta: {
                entity_id: '12'
              },
              options: [],
              parent: 'menu_link_content:34bf58dc-6229-44e3-a6c5-a3b95cd978d4',
              provider: 'menu_link_content',
              route: {
                name: '',
                parameters: []
              },
              title: 'Pre občanov',
              url: '/test',
              weight: '0'
            }
          ]
        },
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:756d9bac-adf9-4fa6-84c3-9416f74a1dc0',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'footer',
          meta: {
            entity_id: '7'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '<nolink>',
            parameters: []
          },
          title: 'Rýchle odkazy',
          url: '',
          weight: '3',
          items: [
            {
              type: 'menu_link_content--menu_link_content',
              id: 'menu_link_content:ca37a25a-baf4-4b93-8f11-980368c236e2',
              description: null,
              enabled: true,
              expanded: false,
              menu_name: 'footer',
              meta: {
                entity_id: '13'
              },
              options: [],
              parent: 'menu_link_content:756d9bac-adf9-4fa6-84c3-9416f74a1dc0',
              provider: 'menu_link_content',
              route: {
                name: '',
                parameters: []
              },
              title: 'Často kladené otázky',
              url: '/test',
              weight: '0'
            }
          ]
        }
      ],
      footerAside: [
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:a05c0df1-d9d2-4229-ab64-16f39328faa1',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'footer-aside',
          meta: {
            entity_id: '17'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '',
            parameters: []
          },
          title: 'Mapa stránok',
          url: '/test',
          weight: '0'
        },
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:c589e792-045b-47a8-8a73-5f9b788fdf54',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'footer-aside',
          meta: {
            entity_id: '19'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '',
            parameters: []
          },
          title: 'Ochrana osobných údajov',
          url: '/test',
          weight: '0'
        },
        {
          type: 'menu_link_content--menu_link_content',
          id: 'menu_link_content:88f5adef-2549-459f-921b-46d91b3808cf',
          description: null,
          enabled: true,
          expanded: false,
          menu_name: 'footer-aside',
          meta: {
            entity_id: '18'
          },
          options: [],
          parent: '',
          provider: 'menu_link_content',
          route: {
            name: '',
            parameters: []
          },
          title: 'RSS',
          url: '/test',
          weight: '0'
        }
      ]
    } as unknown as MenuData;
    const mockPath = {
      entity: {
        aliases: {
          sk: '/',
          en: '/'
        }
      }
    } as PathObject;
    const { asFragment } = render(
      <IndexPage
        menuData={mockMenuData}
        node={mockNode}
        layoutData={mockLayoutData}
        path={mockPath}
      />,
      {}
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
