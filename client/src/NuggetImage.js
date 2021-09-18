import { useState } from 'react'
import { Component } from './flags'
import { dashcase, log_error } from './toolbox'

export const NuggetImage = ({ week, selected_nugget_type, ...props }) => {
  const [form, set_form] = useState(null)

  const { set_last_update } = props
  const { background, color } = week.color_harmonies.work

  const nugget = week.nuggets[selected_nugget_type]
  const image_extension = nugget?.image_extension
  const image_url =
    nugget &&
    `http://localhost:5000/images/${dashcase(nugget.name)}.${image_extension}`

  const upload_image = async (event) => {
    // format & send data from the form - image and nugget name - to the server
    const form_data = new FormData()
    const image_file = event.target.files[0]
    form_data.append('uploaded_image', image_file)
    form_data.append('nugget_name', dashcase(nugget.name))

    try {
      await fetch('http://localhost:5000/upload', {
        credentials: 'include',
        method: 'POST',
        body: form_data,
      })

      form.reset() // clear the form input

      // store the last update & re-trigger the data fetching
      set_last_update({
        date: new Date(),
        event: `Uploaded ${nugget.name} pic!`,
      })
    } catch (error) {
      log_error(error, `uploading ${nugget.name} pic!`)

      // store the update error to be displayed in the update banner
      set_last_update({
        date: new Date(),
        event:
          error.code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to upload ${nugget.name} pic!`,
      })
    }
  }

  return (
    <Wrapper
      style={{
        color,
        background: image_extension
          ? `center / cover url(${image_url})`
          : background,
      }}
    >
      {nugget && !image_extension && (
        <form ref={set_form}>
          <input type="file" name="uploaded_image" onChange={upload_image} />
        </form>
      )}
    </Wrapper>
  )
}

const Wrapper = Component.flex1.pt50.pb80.ph40.div()
