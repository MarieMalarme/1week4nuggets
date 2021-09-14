import { Component } from './flags'
import { log_error } from './toolbox'

export const DeleteWeekButton = ({ selected_week, set_last_update }) => {
  const delete_week_from_spreadsheet = async () => {
    const week_first_nugget_row = Math.min(
      ...Object.values(selected_week.nuggets).map(({ row }) => row),
    )

    const request = {
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 1224209588,
                dimension: 'ROWS',
                startIndex: selected_week.row - 1,
                endIndex: selected_week.row,
              },
            },
          },
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: 'ROWS',
                startIndex: week_first_nugget_row - 1,
                endIndex: week_first_nugget_row + 3,
              },
            },
          },
        ],
      },
    }

    try {
      console.log(`%c----------------------------------`, 'color: grey')
      console.log(`%c${new Date().toString().split('GMT')[0]}`, 'color: grey')
      console.log(`%cWriting to google spreadsheet...`, 'color: dodgerblue')

      await window.gapi.client.sheets.spreadsheets.batchUpdate(request)
      // await window.gapi.client.sheets.spreadsheets.values.clear(request)

      // store the last update & re-trigger the data fetching
      set_last_update({
        date: new Date(),
        event: `Deleted week ${selected_week.id}`,
      })

      // display the success in console
      console.log(
        `%cWeek ${selected_week.id} successfully deleted!`,
        'color: cyan',
      )
    } catch (error) {
      log_error(error, `deleting week ${selected_week.id}`)

      // store the update error to be displayed in the update banner
      const { code } = error?.result?.error || error
      set_last_update({
        date: new Date(),
        event:
          code === 401 // indicate if the error is unauthorized user
            ? 'You need to be signed in as an authorized user to update the data'
            : `Failed to delete week ${selected_week.id}`,
      })
    }
  }

  return <Button onClick={delete_week_from_spreadsheet}>×</Button>
}

const Button =
  Component.ba0.ol_none.bg_white.w50.h50.b_rad50p.fs25.c_pointer.button()
