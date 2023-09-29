import PropTypes from 'prop-types' // Import PropTypes

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

// Define PropTypes for your component
FileInput.propTypes = {
  onFileSelected: PropTypes.func.isRequired // It should be a function and is required
}

export default FileInput
