import { useState, useEffect } from 'react'
import { get_color_harmony } from './toolbox'
import { Component } from './flags'
import { WeekContent } from './WeekContent'
import { Authentication } from './Authentication'

const Home = () => {
  const [weeks_data, set_weeks_data] = useState([])
  const [is_signed_in, set_is_signed_in] = useState(false)

  useEffect(() => {
    // load the api client library
    window.gapi.load('client', async () => {
      try {
        const { client, auth2 } = window.gapi
        await client.init(gapi_request_params)

        // handle the initial auth state
        set_is_signed_in(auth2.getAuthInstance().isSignedIn.get())

        // listen for auth state changes
        auth2.getAuthInstance().isSignedIn.listen(set_is_signed_in)

        // fetch the spreadsheet's data
        const response = await client.sheets.spreadsheets.values.batchGet({
          spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
          ranges: [weeks_range, nuggets_range],
        })

        // format the fetched data and set it to the state
        const formatted_weeks_data = format_spreadsheet_data(response)
        set_weeks_data(formatted_weeks_data)
      } catch (error) {
        console.log(error)
      }
    })
  }, [])

  if (!weeks_data.length) {
    return <Loader>Loading nuggets from Google Sheets...</Loader>
  }

  return (
    <Page>
      <Authentication is_signed_in={is_signed_in} />
      <WeekContent weeks_data={weeks_data} />
    </Page>
  )
}

const format_spreadsheet_data = (response) => {
  // extract data from the 2 queried ranges and format into arrays of objects
  const [weeks, nuggets] = response.result.valueRanges.map((range) => {
    // extract for each range the first row as an array containing column names:
    // example → ['type', 'name', 'date']
    // extract the other rows as an array of arrays containing data:
    // example → [['event', 'The mouse conference', 'May 2019'], ['book', 'Torrent', 'June 2021']]
    const [column_names, ...rows] = range.values

    // convert the rows' arrays into objects
    return rows.map((columns) => {
      const column_entries = columns.map((value, index) =>
        // generate a 2-value array for each column
        // containing the column name and the column value
        // example 1 → ['name', 'The Mouse conference']
        // example 2 → ['subtype', 'talk']
        [column_names[index], value],
      )
      // create an object with key-value pairs from the 2-value arrays
      // from → [['name', 'The Mouse conference'], ['subtype', 'talk']]
      // into → { name: 'The Mouse conference', subtype: 'talk' }
      return Object.fromEntries(column_entries)
    })
  })

  // convert the data into objects assigned by week
  const nuggets_per_week = weeks.map((week) => ({
    ...week,
    // dispatch & format as an object all the nuggets in their correponding week
    // example → { event: { name: 'The Mouse conference', date: 'May 2019' }, book: { name: 'Torrent', date: 'June 2021' } }
    nuggets: Object.fromEntries(
      nuggets
        .filter((nugget) => nugget.week_id === week.id)
        .map((nugget) => {
          // extract & ignore 'week_id' property since each nugget
          // is now contained in the correponding week
          const { week_id, type, subtype, ...nugget_content } = nugget
          // use the 'type' or 'subtype' to be set as key name of the nugget & spread the rest of the object
          // example → ['event', { name: 'The Mouse conference', date: 'May 2019' }]
          return [type || subtype, { ...nugget_content, subtype }]
        }),
    ),
    // create & add color harmonies for page sections in each week object
    color_harmonies: {
      dates: get_color_harmony(),
      work: get_color_harmony({ darker: true }),
      navigation: get_color_harmony(),
    },
  }))

  return nuggets_per_week
}

// params to send when initialiazing gapi client to access spreadsheets' content
const gapi_request_params = {
  apiKey: process.env.REACT_APP_API_KEY,
  clientId: process.env.REACT_APP_CLIENT_ID,
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets',
}

// to do: calculate dynamically the weeks' amount
// between now and the first week written in the data
const weeks_amount = 3
const nuggets_amount = weeks_amount * 4

// to do: get the columns letters dynamically
// query the ranges - based on the amount of weeks & nuggets to get the rows,
// and add + 1 to amounts to get the columns names' row as well
const weeks_range = `'Weeks'!A1:B${weeks_amount + 1}`
const nuggets_range = `'Nuggets'!A1:K${nuggets_amount + 1}`

const Page = Component.fixed.w100vw.div()
const Loader = Component.fixed.b70.l80.fs50.div()

export default Home
