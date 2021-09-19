import { useState } from 'react'
import { Component } from './flags'
import { dashcase } from './toolbox'
import { update_nugget_cell } from './data'
import { log } from './log'

export const NuggetImage = ({ week, selected_nugget_type, ...props }) => {
  const [form, set_form] = useState(null)
  const [form_key, set_form_key] = useState(`form-upload-${Date.now()}`)

  const { set_last_update, nuggets_sheet_columns } = props
  const { background, color } = week.color_harmonies.work

  const nugget = week.nuggets[selected_nugget_type]
  const image_extension = nugget?.image_extension
  const image_url =
    nugget &&
    `http://localhost:5000/images/${dashcase(nugget.name)}.${image_extension}`

  return (
    <Form
      elemRef={set_form}
      key={form_key}
      style={{
        color,
        background: image_extension
          ? `center / cover url(${image_url})`
          : background,
      }}
    >
      {nugget && (
        <UploadInput
          nuggets_sheet_columns={nuggets_sheet_columns}
          set_last_update={set_last_update}
          set_form_key={set_form_key}
          nugget_name={nugget.name}
          row={nugget.row}
          color={color}
          form={form}
        />
      )}
    </Form>
  )
}

const UploadInput = ({ row, nugget_name, form, color, ...props }) => {
  const { nuggets_sheet_columns, set_last_update, set_form_key } = props

  const upload_image = async (event) => {
    // format & send data from the form - image and nugget name - to the server
    const form_data = new FormData()
    const image_file = event.target.files[0]
    form_data.append('uploaded_image', image_file)
    form_data.append('nugget_name', dashcase(nugget_name))

    const image_file_extension = image_file.name.slice(
      image_file.name.lastIndexOf('.') + 1,
      image_file.name.length,
    )

    try {
      log.write('Uploading image to server')

      // fetch post route to upload the image to the server
      await fetch('http://localhost:5000/upload', {
        credentials: 'include',
        method: 'POST',
        body: form_data,
      })

      console.log(
        `%cImage ${image_file.name} successfully uploaded to the server!`,
        'color: cyan',
      )

      // update nugget image extension value in spreadsheet
      await update_nugget_cell({
        new_value: image_file_extension,
        column: 'image_extension',
        nuggets_sheet_columns,
        row,
      })

      form.reset() // clear the form input

      // store the last update & re-trigger the data fetching
      set_last_update({
        date: new Date(),
        event: `Uploaded ${nugget_name} pic!`,
      })

      // change the form key to refetch the image route
      // - if not, react does not re-render the form since the image path is still the same
      set_form_key(`form-upload-${Date.now()}`)
    } catch (error) {
      log.error(error, `uploading ${nugget_name} pic!`)

      // store the update error to be displayed in the update banner
      set_last_update({
        date: new Date(),
        event:
          error.code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to upload ${nugget_name} pic!`,
      })
    }
  }

  return (
    <Label className="hover_blend_mode_difference">
      <Input type="file" name="uploaded_image" onChange={upload_image} />
      <UploadIcon color={color} />
      <Span>Upload a pic</Span>
    </Label>
  )
}

const UploadIcon = ({ color }) => {
  return (
    <svg width="90px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130">
      <path
        fill="none"
        stroke={color}
        strokeWidth={3.4}
        d="M33.5 48.5 65 17l31.5 31.5M65 93.5V17.5M18 115h94"
      />
    </svg>
  )
}

const Form = Component.relative.h100p.w100p.flex1.form()
const Input = Component.absolute.c_pointer.o0.w100p.h100p.input()
const Label =
  Component.block.fs30.text_center.h100p.w100p.flex.flex_column.ai_center.jc_center.label()
const Span = Component.mt30.span()
