type Config = {
    title: string
    description: string
    rules: Rule[]
}

type Rule = {
    description: string,
    manipulators: Manipulator[]
}

type Manipulator = {
    modifier: string
    modifierVariable: string
    keys: Array<{ from: string, to: string }>
}

const HappyDeletion = [
    { from: 'y', to: '↤' }, { from: 'Y', to: '↦' },
]

const config: Config = {
    title: 'HappyKeyout',
    description: 'HappyKeyout',
    rules: [
        {
            description: 'wander_w',
            manipulators: [
                {
                    modifier: 'w',
                    modifierVariable: 'wander_w',
                    keys: [
                        ...HappyDeletion,
                        { from: '7', to: '7', }, { from: '8', to: '8' }, { from: '9', to: '9', },
                        { from: 'u', to: '4', }, { from: 'i', to: '5' }, { from: 'o', to: '6', },
                        { from: 'j', to: '1', }, { from: 'k', to: '2', }, { from: 'l', to: '3', },
                        { from: 'm', to: '0', }, { from: ',', to: '00', },
                        { from: 'p', to: '+', }, { from: ';', to: '-', }, { from: '[', to: '*', }, { from: '\'', to: '%' },
                    ],
                },
            ]
        },
        {
            description: 'fancy_f',
            manipulators: [
                {
                    modifier: 'f',
                    modifierVariable: 'fancy_f',
                    keys: [
                        ...HappyDeletion,
                        { from: 'i', to: '↑', }, { from: 'j', to: '←' }, { from: 'k', to: '↓', }, { from: 'l', to: '→', },
                        { from: 'u', to: '▲', }, { from: 'o', to: '▼' }, { from: 'm', to: '◄', }, { from: '.', to: '►', },
                        { from: 'o', to: '5' }, { from: 'm', to: '6', },
                        { from: 'j', to: '1', }, { from: 'k', to: '2', }, { from: 'l', to: '3', },
                        { from: 'm', to: '0', }, { from: ',', to: '00', },
                        { from: 'p', to: '+', }, { from: ';', to: '-', }, { from: '[', to: '*', }, { from: '\'', to: '%' },
                    ],
                },
            ]
        },
        {
            description: 'junior_j',
            manipulators: [
                {
                    modifier: 'j',
                    modifierVariable: 'junior_j',
                    keys: [
                        ...HappyDeletion,
                        { from: '1', to: '!', }, { from: '2', to: '@' }, { from: '3', to: '#', }, { from: '4', to: '$', }, { from: '5', to: '%' },
                        { from: 'q', to: '\'', }, { from: 'w', to: '_' }, { from: 'e', to: '=', }, { from: 'r', to: '\\', }, { from: 't', to: '|' },
                        { from: 'a', to: '&', }, { from: 's', to: '<' }, { from: 'd', to: '>', }, { from: 'f', to: '(', }, { from: 'g', to: ')' },
                        { from: 'z', to: '^', }, { from: 'x', to: '{' }, { from: 'c', to: '}', }, { from: 'v', to: '[', }, { from: 'b', to: ']' },
                    ],
                },
            ]
        },
        {
            description: 'extra_x',
            manipulators: [
                {
                    modifier: 'x',
                    modifierVariable: 'extra_x',
                    keys: [
                        ...HappyDeletion,
                        { from: 'u', to: '∆', }, { from: 'j', to: '∇' }, { from: 'm', to: '∅' },
                        { from: 'i', to: '☀', }, { from: 'k', to: '☼', },
                    ],
                },
            ]
        },
    ]
}

const genCode = (key: string) => {
    const NamedKeyMap: Record<string, string> = {
        '-': 'hyphen',
        '=': 'equal_sign',
        '`': 'backquote',
        '[': 'open_bracket',
        ']': 'close_bracket',
        '\\': 'backslash',
        ';': 'semicolon',
        '\'': 'quote',
        ',': 'comma',
        '.': 'period',
        '/': 'slash',
        '↑': 'up_arrow',
        '←': 'left_arrow',
        '↓': 'down_arrow',
        '→': 'right_arrow',
        '▲': 'pageup',
        '▼': 'pagedown',
        '◄': 'home',
        '►': 'end',
        '↤': 'delete_or_backspace',
        '↦': 'delete_forward',
        '∆': 'volume_increment',
        '∇': 'volume_decrement',
        '∅': 'mute',
        '☀': 'display_brightness_increment',
        '☼': 'display_brightness_decrement',
    }
    const ShiftUpKeyMap: Record<string, string> = {
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': 'hyphen',
        '+': 'equal_sign',
        '~': 'backquote',
        '{': 'open_bracket',
        '}': 'close_bracket',
        '|': 'backslash',
        ':': 'semicolon',
        '"': 'quote',
        '<': 'comma',
        '>': 'period',
        '?': 'slash',
    }

    return ShiftUpKeyMap[key]
        ? { key_code: ShiftUpKeyMap[key], modifiers: ['left_shift'] }
        : NamedKeyMap[key]
            ? { key_code: NamedKeyMap[key] }
            : /[a-z]/.test(key) && key === key.toUpperCase()
                ? { key_code: key, modifiers: ['left_shift'] }
                : { key_code: key }
}

const genManipulators = (manipulator: Manipulator) =>
    [
        {
            type: 'basic',
            description: `set virtual modifier as ${manipulator.modifier}`,
            from: {
                key_code: manipulator.modifier,
                modifiers: { optional: ['any'] },
            },
            conditions: [
                { type: 'variable_if', name: 'uniqueModifier', value: 0 },
            ],
            to: [
                { set_variable: { name: 'uniqueModifier', value: 1 } },
                { set_variable: { name: manipulator.modifierVariable, value: 1 } }
            ],
            to_after_key_up: [
                { set_variable: { name: 'uniqueModifier', value: 0 } },
                { set_variable: { name: manipulator.modifierVariable, value: 0 } },
            ],
            to_if_alone: [
                { key_code: manipulator.modifier },
            ],
        }
        ,
        ...manipulator.keys.map(key => (
            {
                type: 'basic',
                description: `from ${key.from} to ${key.to}`,
                conditions: [
                    { type: 'variable_if', name: manipulator.modifierVariable, value: 1 },
                ],
                from: {
                    ...genCode(key.from),
                    modifiers: {
                        optional: [
                            'any'
                        ]
                    }
                },
                to: key.to.split('').map(genCode),
            }
        ))
    ]

const gen = (config: Config) => {
    const keymap = {
        title: config.title,
        rules: config.rules.map(rule => ({
            description: rule.description,
            manipulators: rule.manipulators.map(genManipulators).reduce((acc, c) => acc.concat(c), []),
        }))
    }

    return JSON.stringify(keymap, null, 4)
}

console.log(gen(config))
