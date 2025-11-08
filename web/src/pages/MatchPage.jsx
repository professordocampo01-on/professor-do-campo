import React from 'react'
import Navbar from '../components/Navbar'
import MatchView from '../components/MatchView'
import { useParams } from 'react-router-dom'

export default function MatchPage(){
  const {id} = useParams()
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <MatchView matchId={id} />
      </main>
    </div>
  )
}
