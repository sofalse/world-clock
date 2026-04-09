'use client'
import { useState, useEffect, useRef } from 'react'
import { lookupIATA, type AirportDB } from '@/lib/airports'

interface Props {
  panelIdx: number | null
  db: AirportDB
  dbLoaded: boolean
  onConfirm: (idx: number, iata: string, city: string, tz: string) => void
  onClose: () => void
}

export default function IATAModal({ panelIdx, db, dbLoaded, onConfirm, onClose }: Props) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<{ text: string; cls: string }>({ text: '', cls: '' })
  const inputRef = useRef<HTMLInputElement>(null)
  const visible = panelIdx !== null

  useEffect(() => {
    if (visible) {
      setValue('')
      setStatus({ text: dbLoaded ? '' : 'Loading database...', cls: '' })
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [visible, dbLoaded])

  function handleInput(raw: string) {
    const code = raw.toUpperCase()
    setValue(code)
    if (code.length < 3) { setStatus({ text: '', cls: '' }); return }
    const zone = lookupIATA(code, db)
    if (zone) setStatus({ text: `${zone.city} • ${zone.tz}`, cls: 'ok' })
    else       setStatus({ text: 'Unknown IATA code', cls: 'err' })
  }

  function confirm() {
    if (panelIdx === null) return
    const code = value.toUpperCase().trim()
    const zone = lookupIATA(code, db)
    if (zone) {
      onConfirm(panelIdx, code, zone.city, zone.tz)
      setStatus({ text: `${zone.city} — OK`, cls: 'ok' })
      setTimeout(onClose, 700)
    } else {
      setStatus({ text: 'Unknown IATA code', cls: 'err' })
      inputRef.current?.focus()
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter')  confirm()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className={`modal-overlay${visible ? ' visible' : ''}`} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-title">Enter IATA airport code</div>
        <input
          ref={inputRef}
          className="modal-input"
          maxLength={3}
          placeholder="WAW"
          spellCheck={false}
          autoComplete="off"
          value={value}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={onKey}
        />
        <div className={`modal-status${status.cls ? ' ' + status.cls : ''}`}>{status.text}</div>
        <div className="modal-btns">
          <button className="modal-btn" onClick={onClose}>Cancel</button>
          <button className="modal-btn confirm" onClick={confirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
