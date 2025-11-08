import React from 'react'
import Navbar from '../components/Navbar'
import UploadMatch from '../components/UploadMatch'

export default function Home(){
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-4xl font-extrabold header-title">Professor Do Campo</h1>
        <p className="mt-2 text-gray-300">Análises diárias e predições de partidas — futurista e práticas.</p>
        <section className="mt-6">
          <UploadMatch />
        </section>
      </main>
    </div>
  )
}
