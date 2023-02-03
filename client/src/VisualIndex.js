import { useEffect, useState } from 'react'
import { Component } from './flags'
import { get_color_harmony } from './toolbox'
import { CloseIcon } from './components'

export const VisualIndex = ({ nuggets, select_nugget, ...props }) => {
  const [wrapper, set_wrapper] = useState(null)
  const reversed_nuggets = [...nuggets].reverse()
  const { is_open, set_is_open } = props

  useEffect(() => {
    if (!wrapper || !is_open) return
    wrapper.focus()
  }, [is_open, wrapper])

  const close_index = () => set_is_open(false)
  const escape_index = (event) => {
    if (event.key !== 'Escape') return
    close_index()
  }

  const open_nugget = (nugget) => {
    select_nugget(nugget)
    close_index()
  }

  return (
    <Images
      tabIndex="0"
      hidden={!is_open}
      visible={is_open}
      elemRef={set_wrapper}
      onKeyDown={escape_index}
      style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '50px' }}
    >
      <CloseIcon close={close_index} fixed />
      {reversed_nuggets.map((nugget) => (
        <Image nugget={nugget} open_nugget={open_nugget} />
      ))}
    </Images>
  )
}

const Image = ({ nugget, open_nugget }) => {
  const [is_hovered, set_is_hovered] = useState(false)
  const { image_extension, id } = nugget
  if (!image_extension) return null
  const image_file_name = `nugget_${id}.${image_extension}`
  const image_url = `${process.env.REACT_APP_API}/images/${image_file_name}`
  const background = `center / cover url(${image_url})`

  const infos = Object.entries({
    name: get_color_harmony({ darker: true }),
    participants: get_color_harmony(),
  })

  return (
    <Cell
      key={id}
      alt={`nugget-${id}`}
      style={{ background }}
      onClick={() => open_nugget(nugget)}
      onMouseEnter={() => set_is_hovered(true)}
      onMouseLeave={() => set_is_hovered(false)}
    >
      {is_hovered &&
        infos.map(([key, { color, background }]) => (
          <Info style={{ color: color, background: background }}>
            <Text>{nugget[key].replaceAll('  ✽  ', ', ')}</Text>
          </Info>
        ))}
    </Cell>
  )
}

const Images =
  Component.pa50.ofy_scroll.grid.fixed.zi20.bg_white.w100vw.h100vh.div()
const Cell = Component.ratio1.c_pointer.w100p.h100p.min_w100p.div()
const Info = Component.fs25.pa25.flex.ai_center.jc_center.h50p.text_center.div()
const Text = Component.line_clamp.div()
