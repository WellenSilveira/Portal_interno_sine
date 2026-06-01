import './Input.css'

export default function Input({
  label,
  placeholder,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  error,
  disabled = false,
  ...props
}) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {Icon && <Icon className="input-icon" size={20} />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input-field ${Icon ? 'with-icon' : ''} ${error ? 'error' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
