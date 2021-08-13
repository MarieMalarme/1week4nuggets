import { useState, useEffect } from 'react'
import { Component } from './flags'
import { log_error } from './toolbox'

export const EditableText = ({ value, row, column, ...props }) => {
  const { is_editing, set_is_editing } = props
  const { set_last_data_update, selected_week_index } = props
  const [textarea_ref, set_textarea_ref] = useState(null)
  const [text, set_text] = useState(value)
  const [height, set_height] = useState(0)
  const [is_hovered, set_is_hovered] = useState(false)

  // initialize textarea's height when a week is selected
  useEffect(() => set_height(0), [selected_week_index])

  // set textarea's text when the data is fetched or updated from the spreadsheet
  useEffect(() => set_text(value), [value])

  // set the height of the textarea element anytime the text changes
  // to auto resize the textarea according to the text
  useEffect(() => {
    if (!textarea_ref) return
    set_height(textarea_ref.scrollHeight)
  }, [textarea_ref, text])

  const update_spreadsheet = async (new_value) => {
    const request = {
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
      includeValuesInResponse: true,
      valueInputOption: 'USER_ENTERED',
      range: `'Nuggets'!G${row}`,
      values: [[new_value]],
      majorDimension: 'ROWS',
    }

    try {
      console.log(`%c----------------------------------`, 'color: grey')
      console.log(`%c${new Date().toString().split('GMT')[0]}`, 'color: grey')
      console.log(`%cWriting to google spreadsheet...`, 'color: dodgerblue')

      const { values } = window.gapi.client.sheets.spreadsheets
      const response = await values.update(request)

      // store the last update & re-trigger the data fetching
      set_last_data_update({
        date: new Date(),
        event: `Updated column ${column}`,
      })

      // display the success in console
      console.log(`%cColumn ${column} successfully updated!`, 'color: cyan')
      console.log(
        `%cValue sent to cell G${row}: %c${response.result.updatedData.values[0]}`,
        'color: grey',
        'color: lightgrey',
      )
    } catch (error) {
      log_error(error, 'updating the spreadsheet')

      // store the update error to be displayed in the update banner
      set_last_data_update({
        date: new Date(),
        event: `Failed to update column ${column}`,
      })
    }
  }

  return (
    <Wrapper>
      <EditingCommands is_editing={is_editing} is_hovered={is_hovered} />
      <TextArea
        rows={1}
        value={text}
        elemRef={set_textarea_ref}
        placeholder="Write a description"
        style={{ maxHeight: `${height}px` }}
        onMouseEnter={() => set_is_hovered(true)}
        onMouseLeave={() => set_is_hovered(false)}
        onFocus={() => set_is_editing(true)} // enter edit mode when focusing the textarea
        onBlur={(event) => {
          // update the spreadsheet if the value has changed
          const { target } = event
          if (target.value !== value) update_spreadsheet(target.value)
          set_is_editing(false) // exit edit mode when clicking outside the textarea
        }}
        onChange={(event) => {
          set_height(0)
          set_text(event.target.value)
        }}
        onKeyDown={(event) => {
          const pressing_enter = event.key === 'Enter'
          const breaking_line = pressing_enter && event.shiftKey
          // trigger only when the enter key is pressed alone;
          // ignore if the enter key is pressed in combination with shift key,
          // so the user can still break lines while editing the textarea
          if (breaking_line || !pressing_enter) return
          // blur the input to trigger the onBlur event
          // that updates the spreadsheet and exits the edit mode
          textarea_ref.blur()
        }}
      />
    </Wrapper>
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

const Wrapper = Component.h100p.relative.div()
const TextArea = Component.h100p.lh17.fs14.w100p.ba0.ol_none.textarea()
const Command =
  Component.h15.flex.ai_center.ml_command.grey2.uppercase.fs10.ls2.absolute.div()
const Icon = Component.fs14.mr10.span()
