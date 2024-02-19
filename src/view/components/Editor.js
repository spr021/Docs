import { Lock, LockOpen, TextFields } from "@mui/icons-material"
import { Box, Button, Stack } from "@mui/material"
import { useCallback, useRef, useState } from "react"
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  TableBubbleMenu,
  insertImages,
} from "mui-tiptap"
import EditorMenuControls from "./EditorMenuContorols"
import useExtensions from "./useExtentions"
import { useNavigate } from "react-router-dom"

function fileListToImageFiles(fileList) {
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase()
    return mimeType.startsWith("image/")
  })
}

export default function Editor({ nextStep, setDocText }) {
  const extensions = useExtensions({
    placeholder: "Add your own content here...",
  })
  const rteRef = useRef(null)
  const navigate = useNavigate()
  const [isEditable, setIsEditable] = useState(true)
  const [showMenuBar, setShowMenuBar] = useState(true)
  const draft = localStorage.getItem("draft") ?? ""

  const handleNewImageFiles = useCallback((files, insertPosition) => {
    if (!rteRef.current?.editor) {
      return
    }

    // For the sake of a demo, we don't have a server to upload the files to,
    // so we'll instead convert each one to a local "temporary" object URL.
    // This will not persist properly in a production setting. You should
    // instead upload the image files to your server, or perhaps convert the
    // images to bas64 if you would like to encode the image data directly
    // into the editor content, though that can make the editor content very
    // large. You will probably want to use the same upload function here as
    // for the MenuButtonImageUpload `onUploadFiles` prop.
    const attributesForImageFiles = files.map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
    }))

    insertImages({
      images: attributesForImageFiles,
      editor: rteRef.current.editor,
      insertPosition,
    })
  }, [])

  // Allow for dropping images into the editor
  const handleDrop = useCallback(
    (view, event, _slice, _moved) => {
      if (!(event instanceof DragEvent) || !event.dataTransfer) {
        return false
      }

      const imageFiles = fileListToImageFiles(event.dataTransfer.files)
      if (imageFiles.length > 0) {
        const insertPosition = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })?.pos

        handleNewImageFiles(imageFiles, insertPosition)

        // Return true to treat the event as handled. We call preventDefault
        // ourselves for good measure.
        event.preventDefault()
        return true
      }

      return false
    },
    [handleNewImageFiles]
  )

  // Allow for pasting images
  const handlePaste = useCallback(
    (_view, event, _slice) => {
      if (!event.clipboardData) {
        return false
      }

      const pastedImageFiles = fileListToImageFiles(event.clipboardData.files)
      if (pastedImageFiles.length > 0) {
        handleNewImageFiles(pastedImageFiles)
        // Return true to mark the paste event as handled. This can for
        // instance prevent redundant copies of the same image showing up,
        // like if you right-click and copy an image from within the editor
        // (in which case it will be added to the clipboard both as a file and
        // as HTML, which Tiptap would otherwise separately parse.)
        return true
      }

      // We return false here to allow the standard paste-handler to run.
      return false
    },
    [handleNewImageFiles]
  )

  const SaveToDraft = () => {
    localStorage.setItem("draft", rteRef.current?.editor?.getHTML() ?? "")
    navigate("/")
  }

  return (
    <Box
      sx={{
        my: 4,
        "& .ProseMirror": {
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            scrollMarginTop: showMenuBar ? 50 : 0,
          },
        },
      }}
    >
      <RichTextEditor
        ref={rteRef}
        extensions={extensions}
        content={draft}
        editable={isEditable}
        editorProps={{
          handleDrop: handleDrop,
          handlePaste: handlePaste,
        }}
        renderControls={() => <EditorMenuControls />}
        RichTextFieldProps={{
          // The "outlined" variant is the default (shown here only as
          // example), but can be changed to "standard" to remove the outlined
          // field border from the editor
          variant: "outlined",
          MenuBarProps: {
            hide: !showMenuBar,
          },
          // Below is an example of adding a toggle within the outlined field
          // for showing/hiding the editor menu bar, and a "submit" button for
          // saving/viewing the HTML content
        }}
      >
        {() => (
          <>
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </RichTextEditor>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          py: 1,
          px: 1.5,
        }}
      >
        <MenuButton
          value="formatting"
          tooltipLabel={showMenuBar ? "Hide formatting" : "Show formatting"}
          size="small"
          onClick={() => setShowMenuBar((currentState) => !currentState)}
          selected={showMenuBar}
          IconComponent={TextFields}
        />

        <MenuButton
          value="formatting"
          tooltipLabel={
            isEditable ? "Prevent edits (use read-only mode)" : "Allow edits"
          }
          size="small"
          onClick={() => setIsEditable((currentState) => !currentState)}
          selected={!isEditable}
          IconComponent={isEditable ? Lock : LockOpen}
        />

        <Button
          variant="contained"
          size="small"
          onClick={() => {
            nextStep()
            setDocText(rteRef.current?.editor?.getHTML() ?? "")
          }}
        >
          Save
        </Button>
        <Button variant="contained" size="small" onClick={SaveToDraft}>
          Save To Draft
        </Button>
      </Stack>
    </Box>
  )
}
