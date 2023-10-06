import PropTypes from 'prop-types'

const FileInput = ({ onFileSelected }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      onFileSelected(selectedFile)
    }
  }

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
    </div>
  )
}

FileInput.propTypes = {
  onFileSelected: PropTypes.func.isRequired
}

export default FileInput
