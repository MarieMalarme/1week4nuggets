import { useState, useEffect } from 'react'
import { update_indexes } from './toolbox'
import { Component } from './flags'
import { Navigation } from './Navigation'
import { WeekDates } from './WeekDates'
import { WeekWork } from './WeekWork'
import { WeekNuggets } from './WeekNuggets'

export const WeekContent = (props) => {
  const { weeks_data, set_last_update, is_signed_in } = props
  const { nuggets_sheet_columns } = props

  const [selected_week_index, set_selected_week_index] = useState(0)
  const selected_week = weeks_data[selected_week_index]
  const [selected_nugget, set_selected_nugget] = useState(null)
  const [hovered_nugget, set_hovered_nugget] = useState(null)
  const [is_editing, set_is_editing] = useState(false)

  // hooks to set keyboard events' listeners
  useEffect(() => {
    // get the list of all types of nuggets from a week
    const nuggets_types = Object.keys(weeks_data[0].nuggets)

    const handle_keydown = (event) => {
      if (is_editing) return
      const { key } = event

      switch (key) {
        // change week with keyboard's left & right arrows
        case 'ArrowLeft': {
          const { prev_index } = update_indexes(selected_week_index, weeks_data)
          set_selected_week_index(prev_index)
          break
        }
        case 'ArrowRight': {
          const { next_index } = update_indexes(selected_week_index, weeks_data)
          set_selected_week_index(next_index)
          break
        }

        // change hovered nugget with keyboard's up & down arrows
        case 'ArrowUp': {
          const current_index = nuggets_types.indexOf(hovered_nugget)
          const { prev_index } = update_indexes(current_index, nuggets_types)
          set_hovered_nugget(nuggets_types[prev_index])
          break
        }
        case 'ArrowDown': {
          const current_index = nuggets_types.indexOf(hovered_nugget)
          const { next_index } = update_indexes(current_index, nuggets_types)
          set_hovered_nugget(nuggets_types[next_index])
          break
        }

        // change selected nugget with keyboard's Enter
        case 'Enter':
          set_selected_nugget(hovered_nugget)
          break
        // clear selected nugget with keyboard's Escape
        case 'Escape':
          set_selected_nugget(null)
          break

        default:
          return
      }
    }

    window.addEventListener('keydown', handle_keydown)
    return () => window.removeEventListener('keydown', handle_keydown)
  }, [selected_week_index, hovered_nugget, weeks_data, is_editing])

  return (
    <Wrapper>
      <WeekDates week={selected_week} />
      <WeekNuggets
        week={selected_week}
        is_signed_in={is_signed_in}
        set_is_editing={set_is_editing}
        selected_nugget={selected_nugget}
        set_selected_nugget={set_selected_nugget}
        hovered_nugget={hovered_nugget}
        set_hovered_nugget={set_hovered_nugget}
        set_last_update={set_last_update}
        nuggets_sheet_columns={nuggets_sheet_columns}
      />
      <RightPanel>
        <WeekWork week={selected_week} selected_nugget={selected_nugget} />
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
const RightPanel = Component.w40p.flex.flex_column.jc_between.div()
