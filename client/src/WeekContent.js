import { useState } from 'react'
import { Component } from './flags'
import { Navigation } from './Navigation'
import { WeekDates } from './WeekDates'
import { VisualSection } from './VisualSection'
import { WeekNuggets } from './WeekNuggets'

export const WeekContent = (props) => {
  const { weeks_data, set_last_update, is_signed_in } = props
  const { nuggets_sheet_coords } = props

  const [selected_nugget_index, set_selected_nugget_index] = useState(null)
  const [selected_week_index, set_selected_week_index] = useState(0)
  const selected_week = weeks_data[selected_week_index]

  return (
    <Wrapper>
      <WeekDates week={selected_week} />
      <WeekNuggets
        week={selected_week}
        weeks_data={weeks_data}
        is_signed_in={is_signed_in}
        selected_nugget_index={selected_nugget_index}
        set_selected_nugget_index={set_selected_nugget_index}
        selected_week_index={selected_week_index}
        set_selected_week_index={set_selected_week_index}
        set_last_update={set_last_update}
        nuggets_sheet_coords={nuggets_sheet_coords}
      />
      <RightPanel>
        <VisualSection
          week={selected_week}
          nuggets_sheet_coords={nuggets_sheet_coords}
          selected_nugget_index={selected_nugget_index}
          set_last_update={set_last_update}
          is_signed_in={is_signed_in}
        />
        <Navigation
          week={selected_week}
          weeks_data={weeks_data}
          selected_week_index={selected_week_index}
          set_selected_week_index={set_selected_week_index}
        />
      </RightPanel>
    </Wrapper>
  )
}

const Wrapper = Component.h100vh.w100p.flex.jc_between.div()
const RightPanel = Component.w40p.flex.relative.flex_column.jc_between.div()
