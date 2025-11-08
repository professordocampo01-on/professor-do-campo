import React, {useState} from 'react'
import axios from 'axios'

export default function UploadMatch(){
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('pronto')

  const onSubmit = async ()=>{
    if(!file) return alert('Selecione um arquivo')
    setStatus('enviando')
    const fd = new FormData()
    fd.append('file', file)
    try{
      const res = await axios.post('/api/upload-file', fd, { headers: {'Content-Type':'multipart/form-data'} })
      setStatus('enfileirado')
      console.log(res.data)
    }catch(e){
      console.error(e)
      setStatus('erro')
    }
  }

  return (
    <div className="card max-w-xl mx-auto">
      <h3 className="text-2xl font-bold text-pdoc_gold">Enviar partida</h3>
      <input aria-label="Selecione arquivo" type="file" onChange={(e)=>setFile(e.target.files[0])} className="mt-4 w-full" />
      <div className="mt-4 flex gap-2">
        <button onClick={onSubmit} className="btn-gold">Enviar</button>
        <span className="ml-2">Status: {status}</span>
      </div>
    </div>
  )
}
