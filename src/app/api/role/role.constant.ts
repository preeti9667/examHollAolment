export const PERMISSIONS = {
    SUB_ADMIN: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    USER: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    BOOKING: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    ADD_ONS: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    HALL: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
    TIME_SLOT: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
}

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
        permissions: {
            SUB_ADMIN: ['VIEW'],
            USER: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            BOOKING: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            ADD_ONS: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            HALL: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
            TIME_SLOT: ['ADD', 'EDIT', 'DELETE', 'VIEW', 'STATUS'],
        }
    }
]


