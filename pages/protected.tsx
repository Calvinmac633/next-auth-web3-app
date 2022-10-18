import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [content, setContent] = useState([])

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/protected")
      console.log('res: ', res)
      const json = await res.json()
      console.log('json: ', json)
      if (json.nftList) {
        console.log('json.nftList: ', json.nftList)
        setContent(json.nftList)
      }
    }
    fetchData()
  }, [session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
      <h3>Protected content</h3>
      {/* <div>{message}</div> */}
      {content.map((e)=>{
          return (<img src={`https://ipfs.io/ipfs/${JSON.parse(e.metadata).image.split('//')[1]}`} alt="nftImg" height={150}/>)
      })}
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </Layout>
  )
}
