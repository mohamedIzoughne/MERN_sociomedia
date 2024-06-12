
export type friendType = {
  friendId: string
  name: string
  location: string
  imageUrl: string
}

export type userType = {
  email: string
  friends: friendType[] | []
  fullName: string
  location: string
  password: string
  work: string
  imageUrl: string
  posts: []
  profileViews: number
  socialProfiles: {
    [key: string]: string
  }
  _id: string
  impressionsOnPosts: number
}

export type commentsType =
  | {
      _id: string
      content: string
      creatorId: string
      creatorName: string
      creatorImageUrl: string
    }[]
  | []

export type postType = {
  _id: string
  content: string
  fileUrl: string
  fileType: string
  creator: {
    id: string
    name: string
    location: string
    imageUrl: string
  }
  likedByUser: boolean
  likes: Map<string, string>
  comments: commentsType
}

export type postsType = postType[] | []

export type socialType = 'twitter' | 'linkedin' | ''

export type socialMediaType = {
  [key: string]: React.ReactElement
}

export type notificationType = {
  creator: {
    id: string,
    name: string,
    imageUrl: string,
  },
  recipient: string,
  type: string
}

export type notificationCategoriesType = {
  [key: string]: string

}