import { useState, useEffect } from 'react'
import { Component } from './flags'
import { update_indexes } from './toolbox'
import { get_nugget_id, nuggets_types as types } from './data'
import { Nugget } from './Nugget'

export const WeekNuggets = ({ week, weeks_data, ...props }) => {
  const { selected_week_id, set_selected_week_id } = props
  const { selected_nugget, set_selected_nugget } = props

  const [hovered_nugget_index, set_hovered_nugget_index] = useState(null)
  const [is_editing, set_is_editing] = useState(false)

  const nuggets = [...Array(4).keys()].map((index) => {
    // get the week nugget if it exists or set a placeholder with a default type
    const matching_nugget = week.nuggets.find(
      (nugget) => Number(nugget.id) === get_nugget_id(week.id, index + 1),
    )
    return matching_nugget || { id: null, type: types[index], topic: 'graphic' }
  })

  const set_selected_nugget_index_from_id = () => {
    const current_nugget = nuggets.find(({ id }) => id === selected_nugget.id)
    const current_nugget_index = nuggets.indexOf(current_nugget) + 1
    set_selected_nugget({ index: current_nugget_index })
  }

  // set keyboard events' listeners
  const handle_keydown = (event, index) => {
    if (is_editing) return

    switch (event.key) {
      // change week with keyboard's left & right arrows
      case 'ArrowLeft': {
        const { length } = weeks_data
        const { next_index } = update_indexes(selected_week_id, length)
        set_selected_week_id(next_index)
        if (selected_nugget?.id) set_selected_nugget_index_from_id()

        break
      }
      case 'ArrowRight': {
        const { length } = weeks_data
        const { prev_index } = update_indexes(selected_week_id, length)
        set_selected_week_id(prev_index)
        if (selected_nugget?.id) set_selected_nugget_index_from_id()

        break
      }

      // change hovered nugget with keyboard's up & down arrows
      case 'ArrowUp': {
        const { prev_index } = update_indexes(hovered_nugget_index, 4)
        set_hovered_nugget_index(prev_index)
        break
      }
      case 'ArrowDown': {
        const { next_index } = update_indexes(hovered_nugget_index, 4)
        set_hovered_nugget_index(next_index)
        break
      }

      // change selected nugget with keyboard's Enter
      case 'Enter':
        set_selected_nugget({ index: hovered_nugget_index })
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
      {nuggets.map((nugget, index) => (
        <Nugget
          key={`${nugget.type}-${index}`}
          nugget={nugget}
          nuggets={nuggets}
          week_id={week.id}
          index={index + 1}
          font={week.fonts[index]}
          selected_nugget={selected_nugget}
          set_selected_nugget={set_selected_nugget}
          hovered_nugget_index={hovered_nugget_index}
          set_hovered_nugget_index={set_hovered_nugget_index}
          set_is_editing={set_is_editing}
          {...props}
        />
      ))}
    </Nuggets>
  )
}

const Nuggets = Component.w55p.flex.flex_column.div()
