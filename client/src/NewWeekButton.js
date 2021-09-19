import { Component } from './flags'
import { log } from './log'

export const NewWeekButton = ({ weeks_data, set_last_update, ...props }) => {
  const { nuggets_sheet_columns } = props

  const add_week_to_spreadsheet = async () => {
    const { name, week_id, subtype } = nuggets_sheet_columns
    const last_week_row = Math.max(...weeks_data.map(({ row }) => row))
    const last_week_id = Math.max(...weeks_data.map(({ id }) => id))
    const new_week_id = last_week_id + 1
    const last_nugget_row = Math.max(
      ...weeks_data.flatMap((week) =>
        Object.values(week.nuggets).map(({ row }) => row),
      ),
    )

    // column range of the 4 new nuggets to add for the new week
    // example for column A → 'Nuggets'!A13:A16
    const new_week_nuggets_column_range = (column) => {
      const new_row_beginning = last_nugget_row + 1
      const new_row_end = new_row_beginning + 4
      return `'Nuggets'!${column}${new_row_beginning}:${column}${new_row_end}`
    }

    const request = {
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
      valueInputOption: 'USER_ENTERED',
      data: [
        {
          // add a new week in the Weeks spreadsheet with 'id' & 'dates'
          range: `'Weeks'!A${last_week_row + 1}:B${last_week_row + 1}`,
          values: [[new_week_id, get_week_dates()]],
          majorDimension: 'ROWS',
        },
        {
          // add the new week id for the new week's 4 nuggets
          range: new_week_nuggets_column_range(week_id),
          values: [[new_week_id, new_week_id, new_week_id, new_week_id]],
          majorDimension: 'COLUMNS',
        },
        {
          // add the name for the new week's 4 nuggets
          range: new_week_nuggets_column_range(name),
          values: [['Talk', 'Project', 'Book', 'Quote']],
          majorDimension: 'COLUMNS',
        },
        {
          // add the subtype for the new week's 4 nuggets
          range: new_week_nuggets_column_range(subtype),
          values: [['talk', 'project', 'book', 'quote']],
          majorDimension: 'COLUMNS',
        },
      ],
    }

    try {
      console.log(`%c----------------------------------`, 'color: grey')
      console.log(`%c${new Date().toString().split('GMT')[0]}`, 'color: grey')
      console.log(`%cWriting to google spreadsheet...`, 'color: dodgerblue')

      await window.gapi.client.sheets.spreadsheets.values.batchUpdate(request)

      // store the last update & re-trigger the data fetching
      set_last_update({
        date: new Date(),
        event: `Added new week ${new_week_id}`,
      })

      // display the success in console
      console.log(
        `%cNew week ${new_week_id} successfully added!`,
        'color: cyan',
      )
    } catch (error) {
      log.error(error, 'adding a new week')

      // store the update error to be displayed in the update banner
      const { code } = error?.result?.error || error
      set_last_update({
        date: new Date(),
        event:
          code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to add new week`,
      })
    }
  }

  return <Button onClick={add_week_to_spreadsheet}>+</Button>
}

const get_week_dates = () => {
  const today = new Date()
  const date = today.toLocaleString()
  const [day, month, year] = date.slice(0, 10).split('/').map(format_date)
  const week_day = today.getDay()
  const week_monday = day - (week_day - 1)
  const week_sunday = week_monday + 6
  const week_beginning = `${format_date(week_monday)} ${month} ${year}`
  const week_end = `${format_date(week_sunday)} ${month} ${year}`
  return `${week_beginning}\n${week_end}`
}

const format_date = (date) => date.toString().padStart(2, '0')

const Button =
  Component.mb20.ba0.ol_none.bg_white.w50.h50.b_rad50p.fs30.c_pointer.button()
