import { useState, useEffect } from 'react'
import { get_color_harmony } from './toolbox'
import { Component } from './flags'
import { WeekContent } from './WeekContent'

const Home = () => {
  const [weeks_data, set_weeks_data] = useState([])

  useEffect(() => {
    const { gapi } = window
    gapi.load('client', async () => {
      const { client } = gapi
      await client.init({ apiKey: api_key })

      client.load('sheets', 'v4', async () => {
        const response = await client.sheets.spreadsheets.values.batchGet({
          spreadsheetId: spreadsheet_id,
          ranges: [weeks_range, nuggets_range],
        })

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

        set_weeks_data(nuggets_per_week)
      })
    })
  }, [])

  if (!weeks_data.length) {
    return <Loader>Loading nuggets from Google Sheets...</Loader>
  }

  return (
    <Page>
      <WeekContent weeks_data={weeks_data} />
    </Page>
  )
}

const api_key = process.env.REACT_APP_API_KEY
const spreadsheet_id = process.env.REACT_APP_SPREADSHEET_ID

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
