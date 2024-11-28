## 🖥️ ESLint and Prettier Configs
I'll be placing in this directory some ESLint and Prettier configutation files.

## 🐭 EditorConfig
EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. Check it out the [tool page](https://editorconfig.org). Just need to install a plugin on code editor and set a `.editorconfig` file:


```bash
# EditorConfig is awesome: https://EditorConfig.org
# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = false
insert_final_newline = false
```


## ↕️ Sort imports and exports
That's a great plugin for who always keep reordering and formatting imports and exports. Check it out the [plugin repository](https://github.com/lydell/eslint-plugin-simple-import-sort).

**Install depependency:**
```shell
npm i -D eslint-plugin-simple-import-sort
```

**Setup plugin:**
```json
{
  "plugins": ["simple-import-sort"],
  "rules": {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  }
}
```