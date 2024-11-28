## 📝 Typescript helpers
Here are are some helpers that can be used in some projects.

## 1️⃣ Optional utility
Make some properties optional on type

```typescript
type Post {
 id: string;
 name: string;
 email: string;
}
 
Optional<Post, 'id' | 'email'>
```
