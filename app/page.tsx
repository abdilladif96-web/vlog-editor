"use client"
import { useState } from 'react'

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [sessionId, setSessionId] = useState('')
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState('idle')
  const [outputUrl, setOutputUrl] = useState('')

  const handleUpload = async () => {
    if (files.length === 0) return
    const formData = new FormData()
    formData.append('session_id', sessionId || '')
    files.forEach(file => formData.append('files', file))

    setStatus('uploading')
    try {
        const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
        })
        const data = await res.json()
        setSessionId(data.session_id)
        setStatus('uploaded')
    } catch (e) {
        console.error(e)
        setStatus('error uploading')
    }
  }

  const handleEdit = async () => {
    setStatus('processing')
    try {
        const res = await fetch('http://localhost:8000/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ session_id: sessionId, prompt }),
        })
        if (!res.ok) throw new Error('Edit failed')
        const data = await res.json()
        setOutputUrl(`http://localhost:8000${data.output_url}`)
        setStatus('done')
    } catch (e) {
        console.error(e)
        setStatus('error processing')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Vlog Editor Chat</h1>
        
        {/* Upload */}
        <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg mb-8 text-center bg-white/50">
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={e => setFiles(Array.from(e.target.files || []))}
            className="hidden"
            id="upload"
          />
          <label htmlFor="upload" className="cursor-pointer p-4 bg-white rounded-md hover:bg-gray-50 border border-gray-200 text-gray-700 block mx-auto w-max">
            {files.length ? `${files.length} files selected` : 'Upload clips (drag or click)'}
          </label>
          <button onClick={handleUpload} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Next: Describe vlog
          </button>
        </div>

        {/* Chat */}
        <div className="space-y-4 mb-8">
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. 'Make a tight 10-min YouTube vlog, remove silences, add captions'"
            className="w-full p-4 border rounded-lg text-black"
          />
          <button onClick={handleEdit} disabled={status === 'processing'} className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors">
            {status === 'processing' ? 'Editing...' : 'Generate Vlog'}
          </button>
        </div>

        {/* Status & Preview */}
        {status === 'done' && outputUrl && (
          <div className="bg-white p-4 rounded-lg shadow-lg">
             <h3 className="text-lg font-semibold mb-2 text-black">Preview</h3>
             <video src={outputUrl} controls className="w-full rounded-lg bg-black" />
             <div className="mt-4 text-center">
                <a href={outputUrl} download className="text-blue-600 hover:underline">Download Video</a>
             </div>
          </div>
        )}
        {status && <p className="text-center text-sm text-gray-600 uppercase font-tracking-wider mt-4">{status}</p>}
      </div>
    </main>
  )
}
