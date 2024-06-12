## Features and Fixes to Add

<!-- - I don't know why friends don't reflect on the other side -->
  <!-- - change the image of the post publisher(when publishing) -->
  <!-- - in mobile, make a create post icon in the navbar -->
<!-- - pagination in frontend -->
<!-- - make the create post icon work -->
<!-- - loading in multiple places -->

- a better animation for the popup
- I should decompose the context file: make it multiple files
- fix typescript
- deploy
  <!-- - I will put user in context -->
  <!-- - profile views should be correct nor dummy -->
  <!-- - if someone liked, he can't like again -->
  <!-- - dark mode -->
  <!-- - changing the profile image in a post even after changing it from the user -->
  <!-- - change on the design of navigation in the desktop -->
  <!-- - change on the design of profile image in friendList: should be circle -->
  <!-- - ability to add: audio, clip, attachment -->
- make notification after a post comment or like, friend add
- Do not accept friend directly without accepting: notification
- I deal with likes as a map in server, but as an object in client? why? fix problem
- add caching, use useMemo more, browser caching... other sorts of caching.
- inside hte Protected route I should put an outlet that shows the navigation of authenticated users
- ability to remove a post
- remove things related to styled components, I just want tailwind
- impressions on posts
- you should put something
- make a better a better looking scrollbar
<!-- - make a component for showing friends also for mobile -->

### more technical

- using redux instead of context api
<!-- - changing the likes to not be a number in the schema of the database: instead a map(not array to have O(1)) to know who liked and who didn't -->
- think about wether graphQl is better instead of REST Api in this case
- use typescript in the backend
- implement pagination
- make the full name unique
- sometimes, I should not use context/redux
  avoid unperformant code like this one: `sendData<object>('feed/new-post', options, () => {
  updatePosts()`

### Questions: search for

how to implement search? is it only by looking at the letters or u

- if a user removed his account, should I remove all his images?
- sing some sort of AI? or some algorithm? is there any library?
- read about oAuth
- should I put the user object in the store(context or redux)
- does really commits have to only include one job/task? because it's not practical

- why use ref instead of document query selectors
- why is #E9EFFF color is the one that works in this case ??? 'message w-[245px] bg-main bg-white bg-[#E9EFFF] text-black min-w-[61px] p-2 leading-none bg-main' +
