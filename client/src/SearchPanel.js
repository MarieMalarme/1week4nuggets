import { Fragment, useState, useEffect } from 'react'
import { includes_pattern } from './toolbox'
import { Component, Span } from './flags'

export const SearchPanel = ({ nuggets, select_nugget, ...props }) => {
  const [input, set_input] = useState(null)
  const [search_pattern, set_search_pattern] = useState()
  const [wrapper_ref, set_wrapper_ref] = useState(null)
  const [has_scrolled, set_has_scrolled] = useState(false)
  const { is_open, set_is_open } = props

  const search_results = search_pattern
    ? nuggets.filter(
        ({ name, subtitle, participants }) =>
          includes_pattern(name, search_pattern) ||
          includes_pattern(subtitle, search_pattern) ||
          includes_pattern(participants, search_pattern),
      )
    : []

  useEffect(() => {
    if (!input || !is_open) return
    input.focus()
  }, [is_open, input])

  const close_search = () => {
    set_is_open(false)
    set_search_pattern()
  }

  const escape_search = (event) => {
    if (event.key !== 'Escape') return
    close_search()
  }

  const open_nugget = (nugget) => {
    select_nugget(nugget)
    close_search()
  }

  return (
    <SearchPanelWrapper
      id="search-modal"
      onKeyDown={escape_search}
      w0={!is_open}
      w40p={is_open}
      pa50={is_open}
    >
      {is_open && (
        <Fragment>
          <Input
            type="text"
            elemRef={set_input}
            placeholder="Looking for..."
            onInput={(event) => set_search_pattern(event.target.value)}
          />

          <SearchResults
            elemRef={set_wrapper_ref}
            onScroll={() => set_has_scrolled(wrapper_ref?.scrollTop > 0)}
          >
            {has_scrolled && <div className="text-overflow-gradient" />}
            {search_results.map((nugget) => (
              <SearchResult
                key={nugget.id}
                nugget={nugget}
                search_pattern={search_pattern}
                open_nugget={open_nugget}
              />
            ))}
            {search_pattern && !search_results.length && 'No results found!'}
          </SearchResults>
        </Fragment>
      )}
    </SearchPanelWrapper>
  )
}

const SearchResult = ({ nugget, search_pattern, open_nugget }) => {
  const [is_hovered, set_is_hovered] = useState(false)
  const { name, subtitle, participants } = nugget
  const searched_fields = [name, subtitle, participants]

  // check if a string contains matches of the searched pattern
  // if it does, split the string to indicate which chunks
  // match the pattern in order to highlight them
  const match_pattern = (string) => {
    const pattern = search_pattern.toLowerCase()
    if (!string.toLowerCase().includes(pattern)) return undefined
    const regex = new RegExp(String.raw`(${pattern})`, 'i')
    const text_chunks = string
      .split(regex)
      .map((chunk) => ({ chunk, matched: chunk.toLowerCase() === pattern }))
    return text_chunks
  }

  return (
    <Result
      onMouseEnter={() => set_is_hovered(true)}
      onMouseLeave={() => set_is_hovered(false)}
      black={is_hovered}
    >
      {searched_fields.map((field, index) => {
        const pattern_matches = match_pattern(field)
        return (
          <ResultField onClick={() => open_nugget(nugget)} key={index}>
            {pattern_matches?.map(({ chunk, matched }, index) => (
              <Span key={index} lime={matched}>
                {chunk}
              </Span>
            ))}
            {!pattern_matches && field}
          </ResultField>
        )
      })}
    </Result>
  )
}

const SearchPanelWrapper =
  Component.fs40.anim_width.zi10.fixed.t0.r0.h100vh.bg_grey2.div()
const Input = Component.w100p.bg_none.ba0.ol_none.fs50.input()
const SearchResults = Component.of_scroll.pb50.mt50.h100p.div()
const Result = Component.grey6.c_pointer.mb50.div()
const ResultField = Component.mb10.div()
