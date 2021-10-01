import { update_indexes } from './toolbox'
import { Component, Div } from './flags'

export const Navigation = ({ week, weeks_data, ...props }) => {
  const { selected_week_index, set_selected_week_index } = props
  const { background, color } = week.color_harmonies.navigation
  const { next_index, prev_index } = update_indexes(
    selected_week_index,
    weeks_data.length,
  )

  return (
    <Wrapper style={{ background, color }}>
      <Button onClick={() => set_selected_week_index(next_index)}>Prev</Button>
      <Div>
        {selected_week_index + 1}/{weeks_data.length}
      </Div>
      <Button onClick={() => set_selected_week_index(prev_index)}>Next</Button>
    </Wrapper>
  )
}

const Wrapper = Component.fs40.w100p.flex.jc_between.ai_center.ph45.h120.div()
const Button = Component.bg_none.ba0.c_pointer.ol_none.button()
