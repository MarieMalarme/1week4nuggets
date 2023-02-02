import { Component } from './flags'
import { Navigation } from './Navigation'
import { WeekDates } from './WeekDates'
import { VisualSection } from './VisualSection'
import { WeekNuggets } from './WeekNuggets'

export const WeekContent = (props) => {
  const { weeks_data, set_last_update, is_signed_in } = props
  const { nuggets_sheet_coords } = props
  const { set_selected_nugget, selected_nugget } = props
  const { selected_week_id, set_selected_week_id } = props
  const selected_week = weeks_data.find((week) => week.id === selected_week_id)

  return (
    <Wrapper>
      <WeekDates week={selected_week} />
      <WeekNuggets
        week={selected_week}
        weeks_data={weeks_data}
        is_signed_in={is_signed_in}
        selected_week_id={selected_week_id}
        set_selected_week_id={set_selected_week_id}
        set_last_update={set_last_update}
        nuggets_sheet_coords={nuggets_sheet_coords}
        selected_nugget={selected_nugget}
        set_selected_nugget={set_selected_nugget}
      />
      <RightPanel>
        <VisualSection
          week={selected_week}
          selected_nugget={selected_nugget}
          nuggets_sheet_coords={nuggets_sheet_coords}
          set_last_update={set_last_update}
          is_signed_in={is_signed_in}
        />
        <Navigation
          week={selected_week}
          weeks_data={weeks_data}
          selected_week_id={selected_week_id}
          set_selected_week_id={set_selected_week_id}
        />
      </RightPanel>
    </Wrapper>
  )
}

const Wrapper = Component.h100vh.w100p.flex.jc_between.div()
const RightPanel = Component.w40p.flex.relative.flex_column.jc_between.div()
