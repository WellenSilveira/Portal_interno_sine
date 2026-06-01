import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from '../Input'
import './PasswordInput.css'

export default function PasswordInput({
  label = 'Senha',
  placeholder = 'Digite sua senha',
  value,
  onChange,
  error,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="password-input-wrapper">
      <div className="password-input-container">
        <Input
          label={label}
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          error={error}
          {...props}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex="-1"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  )
}
