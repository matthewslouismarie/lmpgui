const WAD_FILENAME_PATTERN = ".+\\.wad$"
const FOLDER_PATH_PATTERN = "^([A-Z]:)?[\/\\].+$"
const EXE_PATH_PATTERN = "^([A-Z]:)?[\/\\].+[.]exe$"

window.lmp.loadSchema().then((schema) => {
    const fc = new FormCreator()
    const form = document.getElementById('schema')
    form.appendChild(fc.createObjectFormRow(null, schema))
})

class FormCreator {
    #tplCheckboxInput;
    #tplFileBtn;
    #tplFileInput;
    #tplSingleFile;
    #tplRow;
    #tplStrInput;

    constructor()  {
        this.#tplCheckboxInput = document.getElementById('tpl-input-checkbox')
        this.#tplFileBtn = document.getElementById('tpl-file')
        this.#tplFileInput = document.getElementById('tpl-input-files')
        this.#tplRow = document.getElementById('tpl-form-row')
        this.#tplStrInput = document.getElementById('tpl-input-string')
        this.#tplSingleFile = document.getElementById('tpl-single-file')
    }

    createFormRow(child = null) {
        const row = this.#tplRow.content.cloneNode(true).querySelector('[data-property=row]')
        if (null !== child) {
            row.appendChild(child)
        }
        return row
    }

    createObjectFormRow(key, schema) {
        const row = this.createFormRow()

        Object.entries(schema.properties).forEach(([key, entry]) => {
            switch (entry.type) {
                case 'string':
                    if (entry.hasOwnProperty('pattern')) {
                        row.appendChild(this.createSingleFileFormRow(key, entry))
                    } else {
                        row.appendChild(this.createStringFormRow(key, entry))
                    }
                    break
                
                case 'boolean':
                    row.appendChild(this.createCheckboxFormRow(key, entry))
                    break
                
                case 'array':
                    if (entry.items.hasOwnProperty('pattern') && WAD_FILENAME_PATTERN === entry.items.pattern) {
                        row.appendChild(this.createWadListFormRom(key, entry))
                    }
                    break
            
                case 'object':
                    row.appendChild(this.createObjectFormRow(key, entry))
                    break

                default:
                    console.log(entry.type)
            }
        })

        return row
    }

    createStringFormRow(key, entry) {
        const clone = this.#tplStrInput.content.cloneNode(true)
        const label = clone.querySelector('[data-property=label]')
        const input = clone.querySelector('[data-property=input]')
        const help = clone.querySelector('[data-property=help]')
        label.htmlFor = key
        label.textContent = entry.title
        input.id = key
        input.name = key
        help.textContent = entry.description;
        return this.createFormRow(clone)
    }

    createSingleFileFormRow(key, entry) {
        const clone = this.#tplSingleFile.content.cloneNode(true)
        const label = clone.querySelector('[data-property=label]')
        const input = clone.querySelector('[data-property=input]')
        const help = clone.querySelector('[data-property=help]')
        label.htmlFor = key
        label.textContent = entry.title
        input.id = key
        input.name = key
        help.textContent = entry.description;
        switch (entry.pattern) {
            case EXE_PATH_PATTERN:
                input.setAttribute('accept', '.exe')
                break

            case FOLDER_PATH_PATTERN:
                input.setAttribute('webkitdirectory', '')
                input.setAttribute('directory', '')
                break
        }
        return this.createFormRow(clone)
    }

    createCheckboxFormRow(key, entry) {
        const clone = this.#tplCheckboxInput.content.cloneNode(true)
        const input = clone.querySelector('[data-property=input]')
        const label = clone.querySelector('[data-property=label]')
        const help = clone.querySelector('[data-property=help]')
        label.htmlFor = key
        label.textContent = entry.title
        input.id = key
        input.name = key
        help.textContent = entry.description
        return this.createFormRow(clone)
    }
    
    createWadListFormRom(key, entry) {
        const clone = this.#tplFileInput.content.cloneNode(true)
        const input = clone.querySelector('[data-property=input]')
        const label = clone.querySelector('[data-property=label]')
        const help = clone.querySelector('[data-property=help]')
        const list = clone.querySelector('[data-property=list]')
        label.htmlFor = key
        label.textContent = entry.title
        input.id = key
        input.name = key
        input.addEventListener('change', (e) => this.onUniqueFileUpdate(e.target, list))
        help.textContent = entry.description
        return this.createFormRow(clone)
    }
    
    onUniqueFileUpdate(input, list) {
        for (let i = 0; i < input.files.length; i++) {
            let fileAlreadyPresent = null;
            list.querySelectorAll('[data-property=file-item]').forEach((fileItem) => {
                if (input.files[i].name === fileItem.dataset.filename) {
                    fileAlreadyPresent = true;
                }
            })
            if (fileAlreadyPresent !== true) {
                const clone = this.#tplFileBtn.content.cloneNode(true)
                const filename = clone.querySelector('[data-property=filename]')
                const fileItem = clone.querySelector('[data-property=file-item]')
                const btn = clone.querySelector('[data-property=btn]')
                fileItem.dataset.filename = input.files[i].name;
                filename.textContent = input.files[i].name;
                list.appendChild(fileItem)
                btn.addEventListener('click', (e) => {
                    list.removeChild(realFileItem)
                })
            }
        }

    }
}
