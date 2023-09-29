function convertArrayBufferToAudioData(arrayBuffer) {
  const dataView = new DataView(arrayBuffer)

  // Read the WAV header information
  const formatChunk = findChunk(dataView, 'fmt ')
  //const audioFormat = dataView.getUint16(formatChunk.offset + 8, true) // Audio format (1 for PCM)
  const numChannels = dataView.getUint16(formatChunk.offset + 10, true) // Number of channels (1 for mono, 2 for stereo)
  //const sampleRate = dataView.getUint32(formatChunk.offset + 12, true) // Sample rate
  const bitsPerSample = dataView.getUint16(formatChunk.offset + 22, true) // Bits per sample

  // Find the data chunk
  const dataChunk = findChunk(dataView, 'data')

  // Calculate the number of audio samples
  const numSamples = dataChunk.size / (bitsPerSample / 8) / numChannels

  // Initialize an array to store the audio data
  const audioData = new Array(numChannels).fill([]).map(() => new Float32Array(numSamples))

  // Read audio samples
  for (let i = 0; i < numSamples; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const byteOffset =
        dataChunk.offset + i * numChannels * (bitsPerSample / 8) + channel * (bitsPerSample / 8)

      // Read and normalize the sample value
      const sampleValue = readSampleValue(dataView, byteOffset, bitsPerSample)
      audioData[channel][i] = sampleValue
    }
  }

  return audioData
}

function findChunk(dataView, chunkId) {
  let offset = 12 // Skip RIFF header
  while (offset < dataView.byteLength) {
    const currentChunkId =
      dataView.getUint8(offset).toString(16) +
      dataView.getUint8(offset + 1).toString(16) +
      dataView.getUint8(offset + 2).toString(16) +
      dataView.getUint8(offset + 3).toString(16)

    console.log(`Checking chunk at offset ${offset}: ${currentChunkId}`) // Add this line for debugging

    if (currentChunkId === chunkId) {
      const size = dataView.getUint32(offset + 4, true)
      return { offset: offset + 8, size }
    }

    offset += 8 + dataView.getUint32(offset + 4, true)
  }

  throw new Error(`Chunk "${chunkId}" not found in the WAV file.`)
}

// Utility function to read and normalize sample values based on bits per sample
function readSampleValue(dataView, byteOffset, bitsPerSample) {
  switch (bitsPerSample) {
    case 8:
      // 8-bit samples are unsigned, so we need to shift to normalize them
      return (dataView.getUint8(byteOffset) - 128) / 128.0
    case 16:
      return dataView.getInt16(byteOffset, true) / 32768.0
    case 32:
      return dataView.getInt32(byteOffset, true) / 2147483648.0
    default:
      throw new Error(`Unsupported bits per sample: ${bitsPerSample}`)
  }
}

export default convertArrayBufferToAudioData
