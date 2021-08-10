import { Component } from './flags'

export const WeekDates = ({ week }) => {
  const { color, background } = week.color_harmonies.dates
  const [beginning, end] = week.dates.split('\n')

  return (
    <Wrapper style={{ background, color }}>
      <Date fs20>{beginning}</Date>
      <Date fs16 ls5>
        TO
      </Date>
      <Date fs20>{end}</Date>
    </Wrapper>
  )
}

const Wrapper = Component.w5p.flex.flex_column.jc_between.ai_center.pv30.div()
const Date = Component.fw500.wm_v_rl.text_upright.div()
