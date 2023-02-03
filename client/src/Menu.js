import { Fragment, useState } from 'react'
import { Component } from './flags'
import { SearchPanel } from './SearchPanel'
import { VisualIndex } from './VisualIndex'

export const Menu = ({ nuggets, is_signed_in, select_nugget }) => {
  const [is_search_open, set_is_search_open] = useState(false)
  const [is_index_open, set_is_index_open] = useState(false)

  return (
    <Fragment>
      <Nav>
        <SearchIcon open_search={() => set_is_search_open(true)} />
        <IndexIcon open_index={() => set_is_index_open(true)} />
        <Authentication is_signed_in={is_signed_in} />
      </Nav>

      <VisualIndex
        nuggets={nuggets}
        is_open={is_index_open}
        set_is_open={set_is_index_open}
        select_nugget={select_nugget}
        set_is_index_open={set_is_index_open}
      />

      <SearchPanel
        nuggets={nuggets}
        select_nugget={select_nugget}
        is_open={is_search_open}
        set_is_open={set_is_search_open}
      />
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

const IndexIcon = ({ open_index }) => {
  return (
    <Svg
      onClick={open_index}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130 130"
      height={24}
      width={24}
    >
      <path
        fill="white"
        d="M20.11 23.5h12v12h-12zM58 23.5h12v12H58zM95.89 23.5h12v12h-12zM20.11 59h12v12h-12zM58 59h12v12H58zM95.89 59h12v12h-12zM20.11 94.5h12v12h-12zM58 94.5h12v12H58zM95.89 94.5h12v12h-12z"
      />
    </Svg>
  )
}

const Authentication = ({ is_signed_in }) => {
  const { signIn, signOut } = window.gapi.auth2.getAuthInstance()

  return (
    <Button ph20 onClick={is_signed_in ? signOut : signIn}>
      {is_signed_in ? 'o u t' : 'i n'}
    </Button>
  )
}

const Nav = Component.flex.ai_center.blend_difference.zi1.fixed.t20.r20.nav()
const Svg = Component.mr20.c_pointer.svg()
const Button =
  Component.h30.flex.ai_center.jc_center.white.b_white.c_pointer.fw700.shadow_a_s.ba.b_rad20.uppercase.ls1.fs9.div()
