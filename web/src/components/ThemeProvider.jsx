import React from 'react'

export default function ThemeProvider({children}){
  return (
    <div style={{minHeight:'100vh', background:'#000000'}} className="text-white">
      {children}
    </div>
  )
}
