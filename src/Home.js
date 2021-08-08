import { useState, useEffect } from 'react'
import { weeks_content } from './weeks_content.data'
import { update_indexes, get_color_harmony, nuggets_types } from './toolbox'
import { Component } from './flags'
import { Navigation } from './Navigation'
import { WeekDates } from './WeekDates'
import { WeekWork } from './WeekWork'
import { WeekNuggets } from './WeekNuggets'

const Home = () => {
  const [selected_week_index, set_selected_week_index] = useState(0)
  const selected_week = weeks_data[selected_week_index]
  const [selected_nugget, set_selected_nugget] = useState(null)
  const [hovered_nugget, set_hovered_nugget] = useState(null)
  const [is_editing, set_is_editing] = useState(false)

  // hooks to set events' listeners
  useEffect(() => {
    // change week with mousewheel's scroll
    let timeout
    const update_week_index = (event) => {
      if (is_editing) return
      // triggers the event only when the mouse wheel event is consequent enough
      if (event.deltaY > -20 && event.deltaY < 20) return
      const scrolling_down = event.deltaY > 0
      const { next_index, prev_index } = update_indexes(selected_week_index)
      const new_index = scrolling_down ? next_index : prev_index
      // timeout to not spam the mousewheel event
      clearTimeout(timeout)
      timeout = setTimeout(() => set_selected_week_index(new_index), 100)
    }

    window.addEventListener('mousewheel', update_week_index)
    return () => window.removeEventListener('mousewheel', update_week_index)
  }, [selected_week_index, is_editing])

  useEffect(() => {
    const handle_keydown = (event) => {
      if (is_editing) return
      const { key } = event

      switch (key) {
        // change week with keyboard's left & right arrows
        case 'ArrowRight':
        case 'ArrowLeft': {
          const { prev_index, next_index } = update_indexes(selected_week_index)
          if (key === 'ArrowRight') set_selected_week_index(next_index)
          if (key === 'ArrowLeft') set_selected_week_index(prev_index)
          break
        }
        // change hovered nugget with keyboard's up & down arrows
        case 'ArrowDown':
        case 'ArrowUp': {
          const current_index = nuggets_types.indexOf(hovered_nugget)
          const { prev_index, next_index } = update_indexes(current_index, true)
          if (key === 'ArrowUp') set_hovered_nugget(nuggets_types[prev_index])
          if (key === 'ArrowDown') set_hovered_nugget(nuggets_types[next_index])
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
  }, [selected_week_index, hovered_nugget, is_editing])

  return (
    <Page>
      <WeekContent>
        <WeekDates week={selected_week} />
        <WeekNuggets
          week={selected_week}
          is_editing={is_editing}
          set_is_editing={set_is_editing}
          selected_nugget={selected_nugget}
          set_selected_nugget={set_selected_nugget}
          hovered_nugget={hovered_nugget}
          set_hovered_nugget={set_hovered_nugget}
        />
        <RightPanel>
          <WeekWork
            week={selected_week}
            selected_week_index={selected_week_index}
            selected_nugget={selected_nugget}
          />
          <Navigation
            week={selected_week}
            selected_week_index={selected_week_index}
            set_selected_week_index={set_selected_week_index}
          />
        </RightPanel>
      </WeekContent>
    </Page>
  )
}

// create & add color harmonies for page sections in each week object
const weeks_data = weeks_content.map((week) => ({
  ...week,
  color_harmonies: {
    dates: get_color_harmony(),
    work: get_color_harmony({ darker: true }),
    navigation: get_color_harmony(),
  },
}))

const Page = Component.fixed.w100vw.div()
const WeekContent = Component.h100vh.w100p.flex.jc_between.div()
const RightPanel = Component.w40p.flex.flex_column.jc_between.div()

export default Home
