import { Fragment, useState, useEffect, useLayoutEffect } from 'react'
import { update_nugget_cell } from './data'
import { Component, Div } from './flags'

export const EditableText = ({ initial_value, row, column, ...props }) => {
  const { states, ...style } = props
  const { id, week_id, type, variables, functions } = states
  const { is_selected, is_signed_in, nuggets_sheet_coords } = variables
  const { set_is_editing, set_last_update } = functions

  const [wrapper_ref, set_wrapper_ref] = useState(null)
  const [text_ref, set_text_ref] = useState(null)
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
    if (!text_ref) return
    text_ref.innerText = initial_value || ''
    set_text(initial_value || '')
  }, [text_ref, row])

  // check if the "description" input has scrollable content
  useLayoutEffect(() => {
    if (!text_ref || !wrapper_ref || column !== 'description') return
    const height = wrapper_ref.clientHeight
    const scroll_height = text_ref.scrollHeight
    set_scrollable(scroll_height > height)
  }, [text, wrapper_ref, text_ref, column])

  // get the styled input component corresponding to the type of item
  const Input = inputs_components[column]

  const update_nugget = () =>
    update_nugget_cell({
      type,
      week_id,
      new_value: text_ref.innerText,
      nuggets_sheet_coords,
      set_last_update,
      column,
      row,
      id,
    })

  // if the user is not signed in, do not display the component when the text is empty
  // so the user without writing access can't see the placeholder with instructions to edit
  // with 2 exceptions: display the type for the name & 'no content' for the description
  if (!is_signed_in && !initial_value) {
    if (column !== 'name' && column !== 'description') return null
    return (
      <Wrapper key={`placeholder-${type}`}>
        <Input capitalize {...style}>
          {column === 'name' ? type : 'No content!'}
        </Input>
      </Wrapper>
    )
  }

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
          id={column}
          block={!text?.length}
          elemRef={set_text_ref}
          placeholder={`+  Add ${column}`}
          contentEditable={is_signed_in && is_selected && 'plaintext-only'}
          c_text={is_signed_in && is_selected && 'plaintext-only'}
          onInput={() => {
            const { innerText } = text_ref
            const whitespace_value = !innerText.trim().length
            set_text(innerText)

            // check if the input value has changed
            if (innerText === initial_value) return
            // if the value is only whitespaces, or already empty, do not update the spreadsheet with an empty string
            if (whitespace_value && (!initial_value || innerText.length)) return

            // update the spreadsheet with the new value 2 seconds after the user stopped typing
            clearTimeout(timeout_id)
            timeout_id = setTimeout(update_nugget, 2500)
          }}
          onFocus={() => set_is_editing(column)} // enter edit mode when focusing the textarea
          onBlur={() => {
            // check if the input value has changed
            if (text === initial_value) return

            // if the value is only whitespaces, set the text to an empty string
            if (!text.trim().length && (!initial_value || text.length)) {
              text_ref.innerText = ''
              set_text('')
              // if the inital value was already empty, do not update the spreadsheet with an empty string
              if (!initial_value || initial_value === '') return
            }

            // clear the timeout id in case the function in the onInput event was already triggered
            clearTimeout(timeout_id)
            // update the spreadsheet with the new value
            update_nugget()

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
            text_ref.blur()
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
  if (fully_scrolled || !wrapper_ref) return null
  const { top: ref_top, height, width } = wrapper_ref.getBoundingClientRect()
  const top = direction === 'top' ? ref_top : ref_top + height - 100
  return <Div style={{ top, width }} className={`gradient to-${direction}`} />
}

const inputs_components = {
  name: Component.ws_pre_w.ol_none.span(),
  participants: Component.ws_pre_w.ol_none.div(),
  subtitle: Component.ws_pre_w.mt10.fs40.lh45.grey3.ol_none.div(),
  description: Component.mt30.ws_pre_w.lh17.fs14.w100p.ol_none.div(),
  date: Component.ws_pre_w.uppercase.ol_none.ls2.fs10.mt60.mb15.grey3.div(),
  link: Component.ws_pre_w.uppercase.ol_none.ls2.fs10.w100p.grey3.span(),
}

let timeout_id
const initial_fully_scrolled = { top: true, bottom: false }
const Wrapper = Component.w100p.div()
