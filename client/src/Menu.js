import { Component } from './flags'

export const Menu = ({ is_signed_in }) => (
  <Nav>
    <SearchIcon />
    <Authentication is_signed_in={is_signed_in} />
  </Nav>
)

const SearchIcon = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 130 130"
    height={20}
    width={20}
  >
    <path
      d="M54 95A43 43 0 1 0 10 52 43 43 0 0 0 54 95ZM81 82l39 39"
      strokeWidth={8}
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
const Svg = Component.mr20.svg()
const Button =
  Component.h30.flex.ai_center.jc_center.white.b_white.c_pointer.fw700.shadow_a_s.ba.b_rad20.uppercase.ls1.fs9.div()
