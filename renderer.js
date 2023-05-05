const WAD_FILENAME_PATTERN = ".+\\.wad$"

window.lmp.loadSchema().then((schema) => {
    const tplStrInput = document.getElementById('tpl-input-string')
    const tplCheckboxInput = document.getElementById('tpl-input-checkbox')
    const tplFileInput = document.getElementById('tpl-input-files')
    const tplFileBtn = document.getElementById('tpl-file')
    const form = document.getElementById('schema')

    Object.entries(schema.properties).forEach(([key, entry]) => {
        switch (entry.type) {
            case 'string':
                form.appendChild(createStringFormRow(tplStrInput, key, entry))
                break
            
            case 'boolean':
                form.appendChild(createCheckboxFormRow(tplCheckboxInput, key, entry))
                break
            
            case 'array':
                if (entry.items.hasOwnProperty('pattern') && WAD_FILENAME_PATTERN === entry.items.pattern) {
                    form.appendChild(createWadListFormRom(tplFileBtn, tplFileInput, key, entry))
                }
        }
    })
})

function createStringFormRow(tplStrInput, key, entry) {
    const clone = tplStrInput.content.cloneNode(true)
    const label = clone.querySelector('[data-property=label]')
    const input = clone.querySelector('[data-property=input]')
    const help = clone.querySelector('[data-property=help]')
    label.htmlFor = key
    label.textContent = entry.title
    input.id = key
    input.name = key
    help.textContent = entry.description;
    return clone
}

function createCheckboxFormRow(tplCheckboxInput, key, entry) {
    const clone = tplCheckboxInput.content.cloneNode(true)
    const input = clone.querySelector('[data-property=input]')
    const label = clone.querySelector('[data-property=label]')
    const help = clone.querySelector('[data-property=help]')
    label.htmlFor = key
    label.textContent = entry.title
    input.id = key
    input.name = key
    help.textContent = entry.description
    return clone
}

function createWadListFormRom(tplFileBtn, tplFileInput, key, entry) {
    const clone = tplFileInput.content.cloneNode(true)
    const input = clone.querySelector('[data-property=input]')
    const label = clone.querySelector('[data-property=label]')
    const help = clone.querySelector('[data-property=help]')
    const list = clone.querySelector('[data-property=list]')
    label.htmlFor = key
    label.textContent = entry.title
    input.id = key
    input.name = key
    input.addEventListener('change', (e) => updateFileFormRow(tplFileBtn, e.target, list))
    help.textContent = entry.description
    return clone
}

function updateFileFormRow(tplFileBtn, input, list) {
    console.log(input.files)
    for (let i = 0; i < input.files.length; i++) {
        let fileAlreadyPresent = null;
        list.querySelectorAll('[data-property=file-item]').forEach((fileItem) => {
            if (input.files[i].name === fileItem.dataset.filename) {
                fileAlreadyPresent = true;
            }
        })
        if (fileAlreadyPresent !== true) {
            const fileItem = tplFileBtn.content.cloneNode(true)
            const filename = fileItem.querySelector('[data-property=filename]')
            const realFileItem = fileItem.querySelector('[data-property=file-item]')
            const btn = fileItem.querySelector('[data-property=btn]')
            realFileItem.dataset.filename = input.files[i].name;
            filename.textContent = input.files[i].name;
            list.appendChild(fileItem)
            btn.addEventListener('click', (e) => {
                list.removeChild(realFileItem)
            })
        }
    }
}