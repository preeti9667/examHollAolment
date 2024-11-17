import { APP_MODULES } from "../api.constant"

export const PERMISSIONS = [
    {
        module: APP_MODULES.SUB_ADMIN,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: APP_MODULES.USER,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: APP_MODULES.BOOKING,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: APP_MODULES.ADD_ONS,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: APP_MODULES.HALL,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: APP_MODULES.TIME_SLOT,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    }
]

export const ROLES = [
    {
        id: 'ce33b161-d701-48a5-9baf-42e7bc528907',
        name: 'SUPER_ADMIN',
        isSuper: true,
        description: 'Admin with all permissions',
        permissions: PERMISSIONS
    },
    {
        id: 'ce33b161-d701-48a5-9baf-42e7bc528908',
        name: 'STAFF',
        isSuper: false,
        description: '',
        permissions: [
            {
                module: APP_MODULES.SUB_ADMIN,
                permissions: ['VIEW'],
            },
            {
                module: APP_MODULES.USER,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: APP_MODULES.BOOKING,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: APP_MODULES.ADD_ONS,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: APP_MODULES.HALL,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: APP_MODULES.TIME_SLOT,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            }
        ]
    }
]


