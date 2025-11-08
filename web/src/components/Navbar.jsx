import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pdoc_gold to-pdoc_gold2 flex items-center justify-center text-black font-bold">P</div>
        <span className="font-bold text-lg header-title">Professor Do Campo</span>
      </div>
      <div className="flex gap-3">
        <Link to="/">Início</Link>
        <a href="#chat">Chat</a>
        <a href="#suporte">Suporte</a>
      </div>
    </nav>
  )
}
