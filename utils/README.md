## ⚙️ Utils
Some cool and always needed helpers:

## 1️⃣ groupBy function
From time to time I need to use the newly or not so `Object.groupBy(items, callbackFn)`, and the problem is that this method is only supported in [newly versions of Node (21.x)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy#browser_compatibility) as an example. I faced this issue after deploying an app at Vercel where the Node version at the time was the 20.x as the newest available or when I was coding a React Native App.

Here a `groupBy` function to group object by a property key with typescript support:
```typescript
const posts = [
 {
   category: 'Category 01';
   title: 'Some title';
 },
 {
   category: 'Category 01';
   title: 'Another title';
 },
 {
   category: 'Category 02';
   title: 'Another title';
 },
]

groupBy(posts, 'category')
```