import React, {useEffect, useState} from 'react'
import axios from 'axios'

export default function MatchView({matchId}){
  const [match, setMatch] = useState(null)
  useEffect(()=>{
    axios.get(`/api/match/${matchId}`).then(r=>setMatch(r.data)).catch(()=>{})
  }, [matchId])

  if(!match) return <div className="card">Carregando partida...</div>
  return (
    <div className="card">
      <h2 className="text-2xl font-bold">{match.home_team} vs {match.away_team}</h2>
      <p>Data: {match.date}</p>
    </div>
  )
}
