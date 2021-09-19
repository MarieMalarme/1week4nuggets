const write = (message = 'Writing to google spreadsheet') => {
  console.log(`%c----------------------------------`, 'color: grey')
  console.log(`%c${new Date().toString().split('GMT')[0]}`, 'color: grey')
  console.log(`%c${message}...`, 'color: dodgerblue')
}

const error = (error, event) => {
  const { message, code } = error.result?.error || error
  console.log(`%cOopsie, ${code} error occurred while ${event}!`, 'color: red')
  console.log(`%c✕ ${message}`, 'color: orange')
}

const success = (response, column, cell) => {
  const updated_values = response.result.updatedData.values
  const updated_value = updated_values && updated_values[0]
  console.log(`%cColumn ${column} successfully updated!`, 'color: cyan')
  console.log(
    `%cValue sent to cell ${cell}: %c${updated_value || 'empty string'}`,
    'color: grey',
    'color: lightgrey',
  )
}

export const log = { write, error, success }
