import { AppModuleNames } from "../api.constant"

export const PERMISSIONS = [
    {
        module: AppModuleNames.Admin,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: AppModuleNames.Staff,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: AppModuleNames.User,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: AppModuleNames.Booking,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: AppModuleNames.AddOns,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: AppModuleNames.Hall,
        permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: AppModuleNames.TimeSlot,
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
                module: AppModuleNames.Admin,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.Staff,
                permissions: ['EDIT', 'VIEW'],
            },
            {
                module: AppModuleNames.User,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.Booking,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.AddOns,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.Hall,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.TimeSlot,
                permissions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            }
        ]
    }
]


