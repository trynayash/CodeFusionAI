import React from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { passwordRequirements, PasswordRequirement } from '@/utils/passwordValidation';

interface PasswordValidatorProps {
  password: string;
  onValidationChange: (isValid: boolean) => void;
}

export function PasswordValidator({ password, onValidationChange }: PasswordValidatorProps) {
  const results = passwordRequirements.map(req => ({
    ...req,
    passed: req.test(password)
  }));

  const allPassed = results.every(r => r.passed);
  
  // Notify parent of validation status
  React.useEffect(() => {
    onValidationChange(allPassed);
  }, [allPassed, onValidationChange]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10"
    >
      <h4 className="text-sm font-medium text-white mb-3">Password must contain:</h4>
      <div className="space-y-2">
        {results.map((requirement) => (
          <motion.div
            key={requirement.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <AnimatePresence mode="wait">
              {requirement.passed ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="x"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className={`text-xs ${requirement.passed ? 'text-green-300' : 'text-red-300'}`}>
              {requirement.label}
            </span>
          </motion.div>
        ))}
      </div>
      {allPassed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-green-500/20 rounded border border-green-500/30"
        >
          <p className="text-xs text-green-300 text-center">✓ Password meets all security requirements</p>
        </motion.div>
      )}
    </motion.div>
  );
}