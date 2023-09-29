// src/AudioWaveform.js
import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import PropTypes from 'prop-types' // Import PropTypes

const AutoAudioWaveform = ({ audioUrl }) => {
  const waveformRef = useRef(null)

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      responsive: true,
      height: 200,
      waveColor: 'violet',
      progressColor: 'purple',
      splitChannels: true
    })

    wavesurfer.load(audioUrl)

    return () => {
      wavesurfer.destroy()
    }
  }, [audioUrl])

  return <div ref={waveformRef}></div>
}

// Define PropTypes for your component
AutoAudioWaveform.propTypes = {
  audioUrl: PropTypes.string.isRequired // It should be a string and is required
}

export default AutoAudioWaveform
