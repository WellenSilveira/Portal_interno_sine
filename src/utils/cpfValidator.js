// Formata CPF com máscara: XXX.XXX.XXX-XX
export const formatCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14)
}

// Remove máscara do CPF
export const unformatCPF = (value) => {
  return value.replace(/\D/g, '')
}

// Valida se CPF tem formato correto (11 dígitos)
export const isValidCPFFormat = (cpf) => {
  const cleanCpf = unformatCPF(cpf)
  return cleanCpf.length === 11 && /^\d{11}$/.test(cleanCpf)
}

// Valida CPF com algoritmo de checksum (mais rigoroso)
export const isValidCPF = (cpf) => {
  const cleanCpf = unformatCPF(cpf)

  // Verifica formato
  if (!isValidCPFFormat(cpf)) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false

  // Valida primeiro dígito verificador
  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false

  // Valida segundo dígito verificador
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false

  return true
}
