import { useState } from 'react'
import {
  Box,
  TextField,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { EmojiEmotions, LocationOn } from '@mui/icons-material'
import useAuthStore from '@/store/authStore'
import { generateAvatarUrl } from '@/utils/helpers'

const PostDetails = ({ caption, setCaption, location, setLocation, settings, setSettings }) => {
  const { user } = useAuthStore()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const MAX_CAPTION_LENGTH = 2200

  return (
    <Box sx={{ p: 2 }}>
      {/* User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={generateAvatarUrl(user?.username || 'user')}
          sx={{ width: 32, height: 32, mr: 1.5 }}
        />
        <Typography variant="subtitle2" fontWeight={600}>
          {user?.username || 'username'}
        </Typography>
      </Box>

      {/* Caption */}
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CAPTION_LENGTH) {
            setCaption(e.target.value)
          }
        }}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <IconButton size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <EmojiEmotions />
            </IconButton>
          ),
        }}
        sx={{ mb: 1 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {caption.length}/{MAX_CAPTION_LENGTH}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Location */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
        <TextField
          fullWidth
          placeholder="Add location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Advanced Settings */}
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={settings.hideComments}
              onChange={(e) =>
                setSettings({ ...settings, hideComments: e.target.checked })
              }
            />
          }
          label={
            <Box>
              <Typography variant="body2">Turn off commenting</Typography>
              <Typography variant="caption" color="text.secondary">
                You can change this later
              </Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.hideLikes}
              onChange={(e) =>
                setSettings({ ...settings, hideLikes: e.target.checked })
              }
            />
          }
          label={
            <Box>
              <Typography variant="body2">Hide like and view counts</Typography>
              <Typography variant="caption" color="text.secondary">
                Only you will see the total number
              </Typography>
            </Box>
          }
        />
      </Box>
    </Box>
  )
}

export default PostDetails