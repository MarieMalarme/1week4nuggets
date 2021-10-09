const express = require('express')
const cors = require('cors')
const multer = require('multer')
const body_parser = require('body-parser')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

// set up config with .env file
dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// set up body parser
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

// enable cors to be able to send requests from the client
app.use(cors({ origin: process.env.ALLOWED_ORIGINS, credentials: true }))

const images_folder_path = path.join(__dirname, '/images')
const upload = multer({ dest: images_folder_path })

// handle post route to upload an image file - received by multer in `req.file`
app.post('/upload', upload.single('uploaded_image'), (req, res) => {
  const temp_path = req.file.path
  const file_extension = path.extname(req.file.originalname).toLowerCase()
  const accepted_extensions = ['.png', '.jpg', '.jpeg']

  if (accepted_extensions.includes(file_extension)) {
    const file_name = `${req.body.file_name}${file_extension}`
    const target_path = `${images_folder_path}/${file_name}`

    // save the image in the dedicated `/images` folder
    fs.rename(temp_path, target_path, (err) => {
      if (err) {
        console.log(`error while uploading image ${file_name}!`)
        res.status(404).send(`error while uploading image ${file_name}!`)
        return
      }

      console.log(`image ${file_name} successfully uploaded!`)
      res.status(200).send(`image ${file_name} successfully uploaded!`)
    })

    // check if another file with a different extension already exists
    accepted_extensions
      .filter((extension) => extension !== file_extension)
      .forEach((extension) => {
        const searched_file = `${req.body.file_name}${extension}`
        const searched_path = `${images_folder_path}/${searched_file}`

        // if no file with another extension is found, return
        if (!fs.existsSync(searched_path)) return
        // if a file with another extension is found, delete it
        fs.unlink(searched_path, (err) => {
          if (err) {
            const message = `error while deleting previous image ${searched_file}!`
            console.log(message)
            res.status(404).send(message)
            return
          }
          console.log(`previous image ${searched_file} successfully deleted!`)
        })
      })
  } else {
    fs.unlink(temp_path, (err) => {
      if (err) console.log(err)
      // handle to show an error when the client tries to upload a file with wrong format
      res.status(403).send('image must be .png or .jpg!')
    })
  }
})

// handle delete route to delete an image file
app.delete('/delete', (req, res) => {
  const { file_name } = req.body
  const file_path = `${images_folder_path}/${file_name}`

  fs.unlink(file_path, (err) => {
    if (err) {
      console.log(err)
      res.status(404).send(`error while deleting image file ${file_name}!`)
      return
    }

    res.status(200).send(`image file ${file_name} successfully deleted!`)
  })
})

// serve the images files
app.use('/images', express.static(images_folder_path))

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})
