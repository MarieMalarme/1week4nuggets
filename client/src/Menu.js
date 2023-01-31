import { Fragment, useState, useEffect } from 'react'
import { Component, Span } from './flags'
import { includes_pattern } from './toolbox'

export const Menu = ({ nuggets, is_signed_in }) => {
  const [input, set_input] = useState(null)
  const [is_search_open, set_is_search_open] = useState(false)

  useEffect(() => {
    if (!input || !is_search_open) return
    input.focus()
  }, [is_search_open, input])

  const open_search = () => set_is_search_open(true)
  const close_search = (event) => {
    if (event.key !== 'Escape') return
    set_is_search_open(false)
  }

  return (
    <Fragment>
      <Nav>
        <SearchIcon open_search={open_search} />
        <Authentication is_signed_in={is_signed_in} />
      </Nav>

      <SearchPanelWrapper
        id="search-modal"
        onKeyDown={close_search}
        w0={!is_search_open}
        w40p={is_search_open}
        pa50={is_search_open}
      >
        {is_search_open && (
          <SearchPanel nuggets={nuggets} set_input={set_input} />
        )}
      </SearchPanelWrapper>
    </Fragment>
  )
}

const SearchIcon = ({ open_search }) => (
  <Svg
    onClick={open_search}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 130 130"
    height={20}
    width={20}
  >
    <path
      d="M54 95A43 43 0 1 0 10 52 43 43 0 0 0 54 95ZM81 82l39 39"
      strokeWidth={7.5}
      stroke="white"
      fill="none"
    />
  </Svg>
)

const Authentication = ({ is_signed_in }) => {
  const { signIn, signOut } = window.gapi.auth2.getAuthInstance()

  return (
    <Button ph20 onClick={is_signed_in ? signOut : signIn}>
      {is_signed_in ? 'o u t' : 'i n'}
    </Button>
  )
}

const SearchPanel = ({ nuggets, set_input }) => {
  const [search_pattern, set_search_pattern] = useState()
  const [wrapper_ref, set_wrapper_ref] = useState(null)
  const [has_scrolled, set_has_scrolled] = useState(false)

  const search_results = search_pattern
    ? nuggets.filter(
        ({ name, subtitle, participants }) =>
          includes_pattern(name, search_pattern) ||
          includes_pattern(subtitle, search_pattern) ||
          includes_pattern(participants, search_pattern),
      )
    : []

  return (
    <Fragment>
      <Input
        onInput={(event) => set_search_pattern(event.target.value)}
        elemRef={set_input}
        placeholder="Looking for..."
        type="text"
      />

      <SearchResults
        elemRef={set_wrapper_ref}
        onScroll={() => set_has_scrolled(wrapper_ref?.scrollTop > 0)}
        id="search-results"
      >
        {has_scrolled && <div className="text-overflow-gradient" />}
        {search_results.map((nugget) => (
          <SearchResult
            key={nugget.id}
            nugget={nugget}
            search_pattern={search_pattern}
          />
        ))}
        {search_pattern && !search_results.length && 'No results found!'}
      </SearchResults>
    </Fragment>
  )
}

const SearchResult = ({ nugget, search_pattern }) => {
  const { name, subtitle, participants } = nugget
  const searched_fields = [name, subtitle, participants]
  const [is_hovered, set_is_hovered] = useState(false)

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
          <ResultField key={index}>
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

const Nav = Component.flex.ai_center.blend_difference.zi1.fixed.t20.r20.nav()
const Svg = Component.mr20.c_pointer.svg()
const SearchPanelWrapper =
  Component.fs40.anim_width.zi10.fixed.t0.r0.h100vh.bg_grey2.div()
const Input = Component.w100p.bg_none.ba0.ol_none.fs50.input()
const SearchResults = Component.of_scroll.pb50.mt50.h100p.div()
const Result = Component.grey6.c_pointer.mb50.div()
const ResultField = Component.mb10.div()
const Button =
  Component.h30.flex.ai_center.jc_center.white.b_white.c_pointer.fw700.shadow_a_s.ba.b_rad20.uppercase.ls1.fs9.div()
