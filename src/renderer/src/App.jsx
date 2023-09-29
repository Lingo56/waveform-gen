import { useState } from 'react'
import AudioWaveform from './components/AudioWaveform'
import FileInput from './components/FileInput'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelected = (file) => {
    setSelectedFile(file)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        marginTop: '100px',
        textAlign: 'center' // Center the content horizontally
      }}
      className="App"
    >
      {selectedFile && <AudioWaveform audioUrl={URL.createObjectURL(selectedFile)} />}
      <div style={{ textAlignLast: 'center', margin: 'auto' }}>
        <FileInput onFileSelected={handleFileSelected} />
      </div>
    </div>
  )
}

export default App
