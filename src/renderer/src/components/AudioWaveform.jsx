import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const AudioWaveform = ({ audioUrl }) => {
  const leftCanvasRef = useRef(null)
  const rightCanvasRef = useRef(null)
  const audioInfoRef = useRef(null)

  useEffect(() => {
    const leftCanvas = leftCanvasRef.current
    const leftContext = leftCanvas.getContext('2d')

    const rightCanvas = rightCanvasRef.current
    const rightContext = rightCanvas.getContext('2d')

    const fetchData = async () => {
      try {
        const response = await fetch(audioUrl)
        const arrayBuffer = await response.arrayBuffer()

        // Get sample rate
        const view = new DataView(arrayBuffer)
        const byteOffset = 24 // Offset for the sample rate field in the header
        const littleEndian = true // WAV files use little-endian byte order
        const sampleRate = view.getUint32(byteOffset, littleEndian)

        // Produce audio buffer that can be read into a waveform
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

        // Get the audio data as an array
        const audioData = audioBuffer.getChannelData(1) // Mono audio, change to 1 for stereo

        // Clear the canvases
        leftContext.clearRect(0, 0, leftCanvas.width, leftCanvas.height)
        rightContext.clearRect(0, 0, rightCanvas.width, rightCanvas.height)

        // Set up the line style
        leftContext.lineWidth = 2
        rightContext.lineWidth = 2

        // Calculate the scale factor to fit the waveform in the canvas
        const scaleFactor = leftCanvas.width / audioData.length

        // The number of times to sample the audio file
        const sampleCount = audioData.length

        // How large the gap between samples should be
        let sampleSize = 1

        // If the sample count is large put a cap when drawing waveform (assignment asks for 65536)
        if (sampleCount > 65536) {
          sampleSize = Math.ceil(sampleCount / 65536)
        }

        // Draw left channel (Channel 0) on the first canvas
        leftContext.strokeStyle = 'white'
        leftContext.beginPath()

        for (let i = 0; i < audioBuffer.length; i += sampleSize) {
          const x = i * scaleFactor
          const y = (0.5 + audioBuffer.getChannelData(0)[i] / 2) * leftCanvas.height

          if (i === 0) {
            leftContext.moveTo(x, y)
          } else {
            leftContext.lineTo(x, y)
          }
        }

        leftContext.stroke()

        // Draw right channel (Channel 1) on the second canvas (below)
        rightContext.strokeStyle = 'white'
        rightContext.beginPath()

        for (let i = 0; i < audioBuffer.length; i += sampleSize) {
          const x = i * scaleFactor
          const y = (0.5 + audioBuffer.getChannelData(1)[i] / 2) * rightCanvas.height

          if (i === 0) {
            rightContext.moveTo(x, y)
          } else {
            rightContext.lineTo(x, y)
          }
        }

        rightContext.stroke()

        audioInfoRef.current.innerHTML = `File Sample Count: <span style="color: white">${sampleCount}</span> <br> File Sample Frequency: <span style="color: white">${sampleRate} hz</span>`
      } catch (error) {
        console.error('Error fetching audio data:', error)
      }
    }

    fetchData()
  }, [audioUrl])

  return (
    <div>
      <h2 style={{ margin: '0', verticalAlign: 'top' }}>Left Channel</h2>
      <canvas ref={leftCanvasRef} width={800} height={150} />
      <h2 style={{ margin: '0', verticalAlign: 'top' }}>Right Channel</h2>
      <canvas ref={rightCanvasRef} width={800} height={150} />
      <div ref={audioInfoRef} style={{ margin: '10px', verticalAlign: 'top' }}></div>
    </div>
  )
}

AudioWaveform.propTypes = {
  audioUrl: PropTypes.string.isRequired // URL to the WAV file
}

export default AudioWaveform
