const fs = require('fs')

const config = {
    "title": "Happykeyout"
}

type Manipulator = {
    modifier: string
    description: string
    modifierVariable: string
    keys: Array<{ from: string, to: string }>
}

const genManipulators = (manipulator: Manipulator) => 
[
    { type: 'basic'
    , from:
        { key_code: manipulator.modifier
        , modifiers: { optional: ['any'] },
        }
    , to: [{ set_variable: { name: manipulator.modifierVariable, value: 1 } }]
    , to_after_key_up: [{ set_variable: { name: manipulator.modifierVariable, value: 0 } }]
    , to_if_alone: [{ key_code: manipulator.modifier }]
    }
    ,
    ...manipulator.keys.map(key => (
        { type: 'basic'
        , conditions:
            [{ type: 'variable_if', name: manipulator.modifierVariable, value: 1 }]
        , from: { key_code: key.from }
        , to: [ { key_code: key.to } ]
        }
    ))
]

const gen = (rules: Rule[]) => {
    const ruleFiles = fs

    const keymap = {
        ...config,
        rules: 
    }

    return JSON.stringify(keymap, null, 4)
}