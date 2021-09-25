import { useState, useEffect } from 'react'
import { Component } from './flags'
import { update_indexes } from './toolbox'
import { Nugget } from './Nugget'

export const WeekNuggets = ({ week, weeks_data, ...props }) => {
  const nuggets = nuggets_types.map((type) => [type, week.nuggets[type] || {}])
  const [hovered_nugget, set_hovered_nugget] = useState(null)
  const [is_editing, set_is_editing] = useState(false)

  // set keyboard events' listeners
  const handle_keydown = (event) => {
    if (is_editing) return

    const { selected_week_index, set_selected_week_index } = props
    const { set_selected_nugget } = props

    switch (event.key) {
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

  useEffect(() => {
    window.addEventListener('keydown', handle_keydown)
    return () => window.removeEventListener('keydown', handle_keydown)
  })

  return (
    <Nuggets>
      {nuggets.map(([type, content], index) => (
        <Nugget
          key={type}
          type={type}
          index={index}
          nuggets={nuggets}
          content={content}
          week_id={week.id}
          font={week.fonts[index]}
          hovered_nugget={hovered_nugget}
          set_hovered_nugget={set_hovered_nugget}
          is_editing={is_editing}
          set_is_editing={set_is_editing}
          {...props}
        />
      ))}
    </Nuggets>
  )
}

const nuggets_types = ['event', 'project', 'book', 'quote'] // list of all types of nuggets in a week
const Nuggets = Component.w55p.flex.flex_column.div()
