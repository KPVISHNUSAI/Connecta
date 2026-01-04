import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CreatePostModal from '@/features/posts/components/create/CreatePostModal'

const CreatePostPage = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    navigate(-1) // Go back to previous page
  }

  useEffect(() => {
    setOpen(true)
  }, [])

  return <CreatePostModal open={open} onClose={handleClose} />
}

export default CreatePostPage