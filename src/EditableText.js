import { Fragment, useState, useEffect, useLayoutEffect } from 'react'
import { Component, Div } from './flags'
import { log_error } from './toolbox'

export const EditableText = ({ initial_value, row, column, ...props }) => {
  const { states, ...style } = props
  const { is_selected, is_signed_in, set_is_editing, set_last_update } = states

  const [wrapper_ref, set_wrapper_ref] = useState(null)
  const [textarea_ref, set_textarea_ref] = useState(null)
  const [text, set_text] = useState(null)

  const [scrollable, set_scrollable] = useState(false)
  const [fully_scrolled, set_fully_scrolled] = useState(initial_fully_scrolled)

  // scroll the wrapper to top & set the fully scrolled
  // on init of the wrapper for "description" input
  useEffect(() => {
    if (!wrapper_ref || column !== 'description') return
    wrapper_ref.scroll(0, 0)
    set_fully_scrolled(initial_fully_scrolled)
  }, [wrapper_ref, row, column])

  // set input's text value and text state to the initial value
  // when the data is fetched or updated from the spreadsheet
  useEffect(() => {
    if (!textarea_ref) return
    textarea_ref.innerText = initial_value
    set_text(initial_value)
  }, [textarea_ref, initial_value, row])

  // check if the "description" input has scrollable content
  useLayoutEffect(() => {
    if (!textarea_ref || !wrapper_ref || column !== 'description') return
    const height = wrapper_ref.clientHeight
    const scroll_height = textarea_ref.scrollHeight
    set_scrollable(scroll_height > height)
  }, [text, wrapper_ref, textarea_ref, column])

  // if the user is not signed in, do not display the component when the text is empty
  // so the user without writing access can't see the placeholder with instructions to edit
  if (!is_signed_in && !initial_value) return null

  // to do: also update spreadsheet after editing stops
  const update_spreadsheet = async (new_value) => {
    const request = {
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
      includeValuesInResponse: true,
      valueInputOption: 'USER_ENTERED',
      range: `'Nuggets'!${columns_map[column]}${row}`,
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
      set_last_update({ date: new Date(), event: `Updated column ${column}` })

      // display the success in console
      const updated_values = response.result.updatedData.values
      const updated_value = updated_values && updated_values[0]
      console.log(`%cColumn ${column} successfully updated!`, 'color: cyan')
      console.log(
        `%cValue sent to cell G${row}: %c${updated_value || 'empty string'}`,
        'color: grey',
        'color: lightgrey',
      )
    } catch (error) {
      log_error(error, 'updating the spreadsheet')

      // store the update error to be displayed in the update banner
      const { code } = error?.result?.error || error
      set_last_update({
        date: new Date(),
        event:
          code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to update column ${column}`,
      })
    }
  }

  // get the styled input component corresponding to the type of item
  const Input = inputs_components[column]

  return (
    <Fragment>
      <Wrapper
        elemRef={set_wrapper_ref}
        ofy_scroll={column === 'description'}
        onScroll={() => {
          if (column !== 'description') return
          const { scrollHeight, scrollTop, offsetHeight } = wrapper_ref
          const top_reached = scrollTop === 0
          const bottom_reached = scrollTop === scrollHeight - offsetHeight
          set_fully_scrolled({ bottom: bottom_reached, top: top_reached })
        }}
      >
        <Input
          block={!text?.length}
          elemRef={set_textarea_ref}
          placeholder={`+  Add ${column}`}
          contentEditable={is_signed_in && is_selected && 'plaintext-only'}
          c_text={is_signed_in && is_selected && 'plaintext-only'}
          onInput={() => set_text(textarea_ref.innerText)}
          onFocus={() => set_is_editing(column)} // enter edit mode when focusing the textarea
          onBlur={() => {
            // update the spreadsheet if the input value has changed
            if (text !== initial_value) update_spreadsheet(text)
            // exit edit mode when clicking outside the input
            set_is_editing(false)
          }}
          onKeyDown={(event) => {
            const pressing_enter = event.key === 'Enter'
            const pressing_escape = event.key === 'Escape'
            const breaking_line = pressing_enter && event.shiftKey
            // trigger when the enter or escape key is pressed alone;
            // ignore if the enter key is pressed in combination with shift key,
            // so the user can still break lines while editing the textarea
            if (breaking_line || (!pressing_enter && !pressing_escape)) return
            // blur the input to trigger the onBlur event
            // that updates the spreadsheet and exits the edit mode
            textarea_ref.blur()
          }}
          {...style}
        />
      </Wrapper>
      {scrollable &&
        // display gradients on the "description" input if the content is scrollable
        Object.entries(fully_scrolled).map(([direction, fully_scrolled]) => (
          <Gradient
            key={direction}
            direction={direction}
            fully_scrolled={fully_scrolled}
            wrapper_ref={wrapper_ref}
          />
        ))}
    </Fragment>
  )
}

const Gradient = ({ direction, wrapper_ref, fully_scrolled }) => {
  if (fully_scrolled) return null
  const { top: ref_top, height, width } = wrapper_ref.getBoundingClientRect()
  const top = direction === 'top' ? ref_top : ref_top + height - 100
  return <Div style={{ top, width }} className={`gradient to-${direction}`} />
}

// to do: generate it from the received spreadsheet's data
const columns_map = {
  type: 'A',
  subtype: 'B',
  name: 'C',
  subtitle: 'D',
  participants: 'E',
  description: 'F',
  image: 'G',
  link: 'H',
  date: 'I',
  week_id: 'J',
}

const inputs_components = {
  name: Component.ws_pre_w.lh60.ol_none.span(),
  participants: Component.ws_pre_w.ol_none.div(),
  subtitle: Component.ws_pre_w.mt10.fs40.lh45.italic.grey3.mb40.ol_none.div(),
  description: Component.ws_pre_w.lh17.fs14.w100p.ol_none.div(),
  date: Component.ws_pre_w.uppercase.ol_none.ls2.fs10.mt50.grey3.div(),
}

const initial_fully_scrolled = { top: true, bottom: false }
const Wrapper = Component.w100p.div()
