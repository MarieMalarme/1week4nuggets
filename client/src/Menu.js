import { Fragment, useState, useEffect } from 'react'
import { Component } from './flags'

export const Menu = ({ is_signed_in }) => {
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

      <SearchModal
        id="search-modal"
        onKeyDown={close_search}
        w0={!is_search_open}
        w40p={is_search_open}
        pa50={is_search_open}
      >
        {is_search_open && (
          <Input elemRef={set_input} placeholder="Looking for..." type="text" />
        )}
      </SearchModal>
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

const Nav = Component.flex.ai_center.blend_difference.zi1.fixed.t20.r20.nav()
const Svg = Component.mr20.c_pointer.svg()
const SearchModal = Component.anim_width.zi10.fixed.t0.r0.h100vh.bg_grey3.div()
const Input = Component.w100p.bg_none.ba0.ol_none.fs50.input()
const Button =
  Component.h30.flex.ai_center.jc_center.white.b_white.c_pointer.fw700.shadow_a_s.ba.b_rad20.uppercase.ls1.fs9.div()
