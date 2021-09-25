import { useState } from 'react'
import { Component } from './flags'
import { Navigation } from './Navigation'
import { WeekDates } from './WeekDates'
import { NuggetImage } from './NuggetImage'
import { WeekNuggets } from './WeekNuggets'

export const WeekContent = (props) => {
  const { weeks_data, set_last_update, is_signed_in } = props
  const { nuggets_sheet_columns } = props

  const [selected_nugget, set_selected_nugget] = useState(null)
  const [selected_week_index, set_selected_week_index] = useState(0)
  const selected_week = weeks_data[selected_week_index]

  return (
    <Wrapper>
      <WeekDates week={selected_week} />
      <WeekNuggets
        week={selected_week}
        weeks_data={weeks_data}
        is_signed_in={is_signed_in}
        selected_nugget={selected_nugget}
        set_selected_nugget={set_selected_nugget}
        selected_week_index={selected_week_index}
        set_selected_week_index={set_selected_week_index}
        set_last_update={set_last_update}
        nuggets_sheet_columns={nuggets_sheet_columns}
      />
      <RightPanel>
        <NuggetImage
          week={selected_week}
          nuggets_sheet_columns={nuggets_sheet_columns}
          selected_nugget_type={selected_nugget}
          set_last_update={set_last_update}
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
