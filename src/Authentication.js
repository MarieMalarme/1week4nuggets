import { Component } from './flags'

export const Authentication = ({ is_signed_in }) => {
  const { signIn, signOut } = window.gapi.auth2.getAuthInstance()

  return (
    <Button onClick={is_signed_in ? signOut : signIn}>
      {is_signed_in ? 'out' : 'in'}
    </Button>
  )
}

const Button =
  Component.c_pointer.zi1.fw500.shadow_a_s.fixed.t_40.ba.r25.wm_v_rl.flex.ai_center.text_upright.pt55.pb15.text_left.b_black.w40.b_rad20.uppercase.ls2.fs8.div()
