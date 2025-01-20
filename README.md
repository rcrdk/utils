## 🛟 Utils
I created this repository to put together all utils and helpers that I need from time to time:

---
### 1️⃣ Functions
---

<details>
   <summary>GroupBy</summary>
   
   ---
   [`group-by.ts`](https://github.com/rcrdk/utils/blob/main/functions/group-by.ts)

   Groups an array of objects by a specific key. From time to time I need to use the newly or not so `Object.groupBy(items, callbackFn)`, and the problem was that this method is only supported in [newly versions of Node (21.x)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy#browser_compatibility). I faced this issue after deploying an app at Vercel where the Node version at the time was the 20.x as the newest available or when I was coding a React Native App.

   **Usage:**
   ```typescript
   const data = [
      { id: 1, category: 'A' },
      { id: 2, category: 'B' },
      { id: 3, category: 'A' },
   ];

   groupBy(data, 'category')

   // Result:
   // {
   //   A: [
   //     { id: 1, category: 'A' },
   //     { id: 3, category: 'A' },
   //   ],
   //   B: [
   //     { id: 2, category: 'B' },
   //   ],
   // }
   ```
</details>

<details>
   <summary>Tailwind ClassName Merge</summary>

   ---
   [`tw-cn-merge.ts`](https://github.com/rcrdk/utils/blob/main/functions/tw-cn-merge.ts)

   Combines class names into a single string, handling Tailwind CSS class conflicts.

   **Dependencies:**
   ```JSX
   npm i clsx tailwind-merge
   ```

   **Usage:**
   ```js
      <div className={cn('some-classes', 'more classes')} />
   ```
</details>

<details>
   <summary>Price Formatted to PT-BR</summary>
   
   ---
   [`price-formatted-ptbr.ts`](https://github.com/rcrdk/price-formatted-ptbr.ts/copy-to-clipboard.ts)

   Formats a numeric amount as a currency string in Brazilian Real (BRL).

   **Usage:**
   ```js
   priceFormatted(10000); // '100,00'
   priceFormatted(123456, 100); // '1.234,56'
   priceFormatted(5000, 1); // '5.000,00'
   ```
</details>

<details>
   <summary>Generate Slug</summary>
   
   ---
   [`generate-slug.ts`](https://github.com/rcrdk/utils/blob/main/functions/generate-slug.ts)

   Generates a URL-friendly slug from a given string.

   **Usage:**
   ```js
   generateSlug('Hello World!'); // 'hello-world'
   generateSlug('Café au lait!'); // 'cafe-au-lait'
   generateSlug('   Multiple   Spaces   '); // 'multiple-spaces'
   ```
</details>

<details>
   <summary>Is Query Included?</summary>
   
   ---
   [`is-query-included.ts`](https://github.com/rcrdk/utils/blob/main/is-query-included.ts.ts)

   Checks if the query string is included in the stringToCompare after normalization.

   **Example:**
   ```js
   const query1 = 'café';
   const stringToCompare1 = 'O café está ótimo';

   const result1 = isQueryIncluded(query1, stringToCompare1);
   console.log(result1); // true
   ```

   **Example:**
   ```js
   const query2 = 'hello';
   const stringToCompare2 = '   HeLLo   World!';

   const result2 = isQueryIncluded(query2, stringToCompare2);
   console.log(result2); // true
   ```

   **Example:**
   ```js
   const query3 = 'ça';
   const stringToCompare3 = 'O café está aqui';

   const result3 = isQueryIncluded(query3, stringToCompare3);
   console.log(result3); // true
   ```

   **Example:**
   ```js
   const query4 = 'world';
   const stringToCompare4 = 'Goodbye, everyone!';

   const result4 = isQueryIncluded(query4, stringToCompare4);
   console.log(result4); // false
   ```
</details>

<details>
   <summary>Copy Text To Clipboard</summary>

   ---
   [`copy-to-clipboard.ts`](https://github.com/rcrdk/utils/blob/main/copy-to-clipboard.ts.ts)

   Copies the provided text to the clipboard asynchronously.

   **Usage:**
   ```js
      copyTextToClipboard('Hello, world!');
   ```
</details>

---
### 2️⃣ React
---

<details>
   <summary>Component with 'as' prop</summary>

   ---
   [`component-as-prop.tsx`](https://github.com/rcrdk/utils/blob/main/react/component-as-prop.tsx)

  Create custom components with `as` prop with TypeScript.
</details>

---
### 3️⃣ Shell
---

<details>
   <summary>Convert an entire folder of images to WEBP format</summary>

   ---
   [`convert-image-directory-to-webp.sh`](https://github.com/rcrdk/utils/blob/main/shell/convert-image-directory-to-webp.sh)

  I was having trouble and wasting my time by converting file by file in command line. This script could help you too:  

   **Requirements:**
   - This script works on Unix based systems such as MacOS and Linux.
   - You'll need `cwebp` command available.

   **Steps:**
   1. Download `webp-convert-directory.sh`;
   2. Open terminal;
   3. Access folder containing images;
   4. Run `sh [file_path]`. You can drag and drop file to terminal to get full path:
      - Example: `sh /Users/ricardo/Desktop/webp-convert-directory.sh`
   5. And voilà! All files converted!
</details>


---
### 4️⃣ TypeScript
---

<details>
   <summary>Optional properties on types utility</summary>

   ---
   [`optional.ts`](https://github.com/rcrdk/utils/blob/main/typescript/optional.ts)

  Make some properties optional on type

   ```typescript
   type Post {
   id: string;
   name: string;
   category: string;
   }
   
   Optional<Post, 'id' | 'category'>
   ```
</details>

---
### 5️⃣ Linting
---

<details>
   <summary>React Native + Expo</summary>

   ---
   [`react-native-expo/*`](https://github.com/rcrdk/utils/tree/main/linting/react-native-expo)

   Read the [Expo Docs](https://docs.expo.dev/guides/using-eslint/) on using ESlint and Prettier.

   **Extra Dependencies:**
   ```shell
   npm i -D eslint-plugin-simple-import-sort
   ```
</details>

<details>
   <summary>EditorConfig IDE Plugin</summary>
   
   ---
   EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. Check it out the [tool page](https://editorconfig.org). Just need to install a plugin on code editor and set a `.editorconfig` file:

   **Configuration file example:**
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
</details>

<details>
   <summary>Sort imports and exports</summary>
   
   ---
   That's a great plugin for who always keep reordering and formatting imports and exports. Check it out the [plugin repository](https://github.com/lydell/eslint-plugin-simple-import-sort).

   **Depependencies:**
   ```shell
   npm i -D eslint-plugin-simple-import-sort
   ```

   **Setup:**
   ```json
   {
   "plugins": ["simple-import-sort"],
   "rules": {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
   }
   }
   ```
</details>

<details>
   <summary>Tailwind Prettier Plugin</summary>
   
   ---
   Checkout the [Plugin Docs](https://github.com/tailwindlabs/prettier-plugin-tailwindcss).

   **Dependencies:**
   ```shell
   npm i -D prettier-plugin-tailwindcss
   ```

   **Setup:**
   ```json
   // .prettierrc
   {
      "plugins": ["prettier-plugin-tailwindcss"]
   }
   ```
</details>

<details>
   <summary>Rocketseat Eslint Initial Configs</summary>
   
   ---
   **Dependencies:**
   ```shell
   npm i -D @rocketseat/eslint-config
   ```

   **Usage:**
   ```json
   // [environment]: node, react, next
   {
      "extends": ["@rocketseat/eslint-config/[environment]"]
   }
   ```
</details>

<details>
   <summary>Add type imports</summary>
   
   ---
   **Configuration:**
   ```json
   // .eslintrc.js
   {
      "rules": {
         "@typescript-eslint/consistent-type-imports": [
            "error",
            {
               "prefer": "type-imports"
            }
         ]
      }
   }
   ```
</details>