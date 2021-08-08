import { useState, useEffect } from 'react'
import { Component, Div } from './flags'

export const EditableText = ({ id, value, is_editing, set_is_editing }) => {
  const [textarea_ref, set_textarea_ref] = useState(null)
  const [text, set_text] = useState(value)
  const [height, set_height] = useState(0)
  const [is_hovered, set_is_hovered] = useState(false)

  // reinitialize text & height of the textarea
  // when the chosen week - and so the data, changes
  useEffect(() => {
    set_text(value)
    set_height(0)
  }, [value])

  // set the height of the textarea element anytime the text changes
  // to auto resize the textarea according to the text
  useEffect(() => {
    if (!textarea_ref) return
    set_height(textarea_ref.scrollHeight)
  }, [textarea_ref, text]) // for later maybe set the dependencies on the height (changing with onChange event)
  // }, [textarea_ref, height])

  return (
    <Div h100p relative>
      <EditingCommands is_editing={is_editing} is_hovered={is_hovered} />
      <TextArea
        id={id}
        rows={1}
        value={text}
        elemRef={set_textarea_ref}
        placeholder="Write a description"
        style={{ maxHeight: `${height}px` }}
        onMouseEnter={() => set_is_hovered(true)}
        onMouseLeave={() => set_is_hovered(false)}
        onFocus={() => set_is_editing(true)} // enter edit mode when focusing the textarea
        onBlur={() => set_is_editing(false)} // exit edit mode when clicking outside the textarea
        onChange={(event) => {
          set_height(0)
          set_text(event.target.value)
        }}
        onKeyDown={(event) => {
          const pressing_enter = event.key === 'Enter'
          const breaking_line = pressing_enter && event.shiftKey
          // exit edit mode only when the enter key is pressed alone;
          // ignore if the enter key is pressed in combination with shift key,
          // so the user can still break lines while editing the textarea
          if (breaking_line || !pressing_enter) return
          set_is_editing(false)
          textarea_ref.blur()
        }}
      />
    </Div>
  )
}

const EditingCommands = ({ is_editing, is_hovered }) => {
  if (!is_editing && !is_hovered) return null
  const icon = is_editing ? '↵' : '✳'
  const text = is_editing ? 'Enter' : 'Edit'

  return (
    <Command>
      <Icon mt5={is_editing}>{icon}</Icon>
      {text}
    </Command>
  )
}

const TextArea = Component.h100p.lh17.fs14.w100p.ba0.ol_none.textarea()
const Command =
  Component.h15.flex.ai_center.ml_command.grey2.uppercase.fs10.ls2.absolute.div()
const Icon = Component.fs14.mr10.span()
