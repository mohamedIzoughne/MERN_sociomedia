## Features and Fixes to Add

- profile views should be correct nor dummy
- animation for the popup: learn about framer motion
<!-- - if someone liked, he can't like again -->
- dark mode
- ability to remove a post
<!-- - changing the profile image in a post even after changing it from the user -->
- change on the design of navigation in the desktop
- change on the design of profile image in friendList: should be circle
- change the image of the post publisher(when publishing)
- ability to add: audio, clip, attachment
- make notification after a post comment or like
- Do not accept friend directly without accepting: notification
- I deal with likes as a map in server, but as an object in client? why? fix problem
- add caching, use useMemo more, browser caching... other sorts of caching.
- make a component for showing friends also for mobile

### more technical

- using redux instead of context api
<!-- - changing the likes to not be a number in the schema of the database: instead a map(not array to have O(1)) to know who liked and who didn't -->
- think about wether graphQl is better instead of REST Api in this case
- use typescript in the backend
- implement pagination

### Questions

how to implement search? is it only by looking at the letters or u

- if a user removed his account, should I remove all his images?
- sing some sort of AI? or some algorithm? is there any library?
- read about oAuth
- should I put the user object in the store(context or redux)
