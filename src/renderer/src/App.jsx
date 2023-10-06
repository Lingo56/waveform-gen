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
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
      className="App"
    >
      <div style={{ textAlignLast: 'center', margin: 'auto' }}>
        {selectedFile && <AudioWaveform audioUrl={URL.createObjectURL(selectedFile)} />}
        <div style={{ paddingTop: '20px' }}>
          <FileInput onFileSelected={handleFileSelected} />
        </div>
      </div>
    </div>
  )
}

export default App
