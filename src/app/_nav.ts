import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [ 
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Redes',
    url: '/principal/redes',
    icon: 'icon-folder-alt',
    children: [
      {
        name: 'Comunicaciones',
        url: '/principal/redes/comunicaciones',
        icon: 'icon-globe'
      },
      {
        name: 'Conexiones',
        url: '/principal/redes/conexiones',
        icon: 'icon-link'
      },
      {
        name: 'Monitoreo',
        url: '/principal/redes/monitoreo',
        icon: 'icon-list'
      }
    ]
  },
  {
    name: 'Herramienta',
    url: '/principal/herramientas',
    icon: 'icon-wrench',
    badge: {
      variant: 'info',
      text: 'CESB'
    },
    children: [
      {
        name: 'Funciones',
        url: '/principal/herramientas/funciones',
        icon: 'icon-list'
      },
      {
        name: 'API',
        url: '/principal/herramientas/api',
        icon: 'icon-note'
      },
      {
        name: 'GraphQL',
        url: '/principal/herramientas/graphql',
        icon: 'icon-shuffle',
        attributes: { disabled: true }
      },
      {
        name: 'WorkFlow',
        url: '/principal/herramientas/workflow',
        icon: 'icon-shuffle',
      }
    ]
  },
  {
    name: 'Aplicaciones',
    url: '/principal/aplicaciones',
    icon: 'icon-grid',
    children: [
      {
        name: 'Instalar App',
        url: '/principal/aplicaciones/instalar',
        icon: 'icon-magic-wand'
      },
      {
        name: 'Versiones',
        url: '/principal/aplicaciones/versiones',
        icon: 'icon-globe'
      },
      {
        name: 'Definir Menu',
        url: '/principal/aplicaciones/menu',
        icon: 'icon-list'
      },
      {
        name: 'Monitoreo',
        url: '/principal/aplicaciones/monitoreo',
        icon: 'icon-list'
      },
      {
        name: 'Eventos',
        url: '/principal/aplicaciones/eventos',
        icon: 'icon-list'
      }
    ]
  },
  {
    name: 'Seguridad',
    url: '/principal/seguridad',
    icon: 'icon-lock-open',
    children: [
      {
        name: 'Roles',
        url: '/principal/seguridad/rol',
        icon: 'icon-docs'
      },
      {
        name: 'Perfil',
        url: '/principal/seguridad/perfil',
        icon: 'icon-docs'
      },
      {
        name: 'Usuarios',
        url: '/principal/seguridad/usuario',
        icon: 'icon-user-following'
      }
    ]
  },
  {
    name: 'Opciones',
    url: '/dashboard',
    icon: 'icon-settings',
    badge: {
      variant: 'info',
      text: 'NUEVO'
    },
    children: [
      {
        name: 'Actualizar',
        url: '/principal/opciones/actualizar',
        icon: 'icon-magic-wand'
      },
    ]
  },
  {
    name: 'Cerrar sesion',
    url: '/principal/opciones/cerrar',
    icon: 'icon-close',
    class: 'mt-auto',
    variant: 'warning'
  }
  // ,
  // {
  //   name: 'Cerrar sesion',
  //   url: 'http://coreui.io/angular/',
  //   icon: 'icon-cloud-download',
  //   class: 'mt-auto',
  //   variant: 'success',
  //   attributes: { target: '_blank', rel: 'noopener' } 
  // }
];
