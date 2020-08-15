import { useUser } from '../../utils/userContext'
import Page from '../../components/Page'
import PostField from '../../components/PostField'
import Post from '../../components/Post'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function PostPage () {
  const user = useUser()
  const { id } = useRouter().query
  const [post, setPost] = useState()

  return (
    <Page title={post ? `${post.users[post.author].name}: ${post.content.split('\n')[0]}` : null}>
      {post && post.parent ? <Parent id={post.parent} /> : <></>}

      <Post
        id={id}
        expanded
        onLoad={data => setPost(data)}
      />
      {post ? (
        <PostField
          placeholder={
            post.author.id === user.id ? 'Continue the conversation...' : `Reply to ${post.author.nickname}...`
          }
          parent={post.id}
          key={`reply-${post.id}`}
        />
      ) : <></>}

      {post ? post.children.list.map(id => <Post key={id} id={id} />) : <></>}
    </Page>
  )
}

function Parent ({ id }) {
  const [post, setPost] = useState()

  return (
    <>
      {post && post.parent ? <Parent id={post.parent} /> : <></>}
      <Post
        id={id}
        onLoad={data => setPost(data)}
      />
      <div>
        <div className='mx-auto -my-7 w-1 h-7 bg-primary' />
      </div>
    </>
  )
}
