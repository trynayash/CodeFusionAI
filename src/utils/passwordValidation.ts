interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  description: string;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
    description: 'Password must contain at least 8 characters'
  },
  {
    id: 'uppercase',
    label: 'Contains uppercase letter',
    test: (password) => /[A-Z]/.test(password),
    description: 'Password must contain at least one uppercase letter (A-Z)'
  },
  {
    id: 'lowercase',
    label: 'Contains lowercase letter', 
    test: (password) => /[a-z]/.test(password),
    description: 'Password must contain at least one lowercase letter (a-z)'
  },
  {
    id: 'number',
    label: 'Contains number',
    test: (password) => /\d/.test(password),
    description: 'Password must contain at least one number (0-9)'
  },
  {
    id: 'special',
    label: 'Contains special character',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    description: 'Password must contain at least one special character (!@#$%^&*)'
  }
];

export { passwordRequirements };
export type { PasswordRequirement };