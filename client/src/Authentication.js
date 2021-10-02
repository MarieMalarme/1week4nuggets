import { Component } from './flags'

export const Authentication = ({ is_signed_in }) => {
  const { signIn, signOut } = window.gapi.auth2.getAuthInstance()

  return (
    <Button onClick={is_signed_in ? signOut : signIn}>
      {is_signed_in ? 'o u t' : 'i n'}
    </Button>
  )
}

const Button =
  Component.blend_difference.white.b_white.c_pointer.zi1.fw700.shadow_a_s.fixed.t20.r20.ba.pv10.ph20.b_rad20.uppercase.ls1.fs9.div()
