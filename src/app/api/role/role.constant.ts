import { ApiActionNames, AppModuleNames } from "../api.constant"

export const PERMISSIONS = [
    {
        module: AppModuleNames.Admin,
        actions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    },
    {
        module: AppModuleNames.User,
        actions: Object.values(ApiActionNames),
    },
    {
        module: AppModuleNames.Booking,
        actions: Object.values(ApiActionNames),
    },
    {
        module: AppModuleNames.AddOns,
        actions: Object.values(ApiActionNames),
    },
    {
        module: AppModuleNames.Hall,
        actions: Object.values(ApiActionNames),
    },
    {
        module: AppModuleNames.Role,
        actions: Object.values(ApiActionNames),
    },
    {
        module: AppModuleNames.OffDate,
        actions: Object.values(ApiActionNames),
    },
    {
        module: AppModuleNames.Setting,
        actions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
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
                actions: ['EDIT', 'VIEW'],
            },
            {
                module: AppModuleNames.User,
                actions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.Booking,
                actions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.AddOns,
                actions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            {
                module: AppModuleNames.Hall,
                actions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            },
            // {
            //     module: AppModuleNames.TimeSlot,
            //     actions: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            // }
        ]
    }
]


