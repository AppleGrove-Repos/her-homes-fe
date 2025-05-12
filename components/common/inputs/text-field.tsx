'use client'
import { cn } from '@/lib/utils/utils'
import clsx from 'clsx'
import { AnimatePresence, Variant, motion } from 'framer-motion'
import React, {
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  RefObject,
  useRef,
  useState,
} from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const labelVariants: Record<string, Variant> = {
  focused: {
    translateY: '-15px',
    opacity: 1,
    visibility: 'visible',
  },
  unfocused: {
    color: 'gray',
    translateY: 0,
    opacity: 0,
    visibility: 'hidden',
  },
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  label?: string
  LabelProps?: HTMLAttributes<HTMLLabelElement> | any
  InputProps?: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
  helperText?: string
  helperTextProps?: HTMLAttributes<HTMLHeadingElement>
  multiline?: boolean
  inputSuffix?: ReactElement
  labelClassName?: string
}

export default function TextField({
  InputProps,
  label,
  helperText,
  helperTextProps,
  multiline,
  LabelProps,
  inputSuffix,
  ...props
}: Props) {
  const [labelFocused, setLabelFocused] = useState<boolean>(false)
  const [value, setValue] = useState('')

  const focusLabel = () => setLabelFocused(true)

  return (
    <div
      {...props}
      className={`flex gap-1 flex-col w-full relative ${props.className}`}
    >
      <AnimatePresence>
        {label && (
          <motion.label
            {...LabelProps}
            htmlFor={InputProps?.id}
            className={cn(
              `font-normal absolute top-0 left-0 text-primary`,
              LabelProps?.className,
              helperText && '!text-red-500'
            )}
            variants={labelVariants}
            animate={labelFocused || value ? 'focused' : 'unfocused'}
          >
            {label}
          </motion.label>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 relative">
        {multiline ? (
          <textarea
            {...InputProps}
            onFocus={focusLabel}
            onBlur={() => setLabelFocused(false)}
            className={cn(
              'w-full h-[150px] resize-none py-[.5rem] outline-none border-b border-b-gray-600 focus:border-b-2 focus:border-b-primary transition duration-300 placeholder:text-[.9rem]',
              labelFocused && 'border-b-primary',
              helperText && 'focus:!border-b-red-500',
              InputProps?.className
            )}
          />
        ) : (
          <input
            {...InputProps}
            onFocus={focusLabel}
            onBlur={() => setLabelFocused(false)}
            className={cn(
              'w-full py-[.5rem] outline-none border-b border-b-gray-600 focus:border-b-2 focus:border-b-primary transition duration-300 placeholder:text-[.9rem]',
              labelFocused && 'border-b-primary',
              helperText && 'focus:!border-b-red-500',
              InputProps?.className
            )}
            placeholder={labelFocused ? InputProps?.placeholder : label}
            onChange={(e) => {
              InputProps?.onChange?.(e)
              setValue(e.target.value)
            }}
          />
        )}
        <span
          onFocus={focusLabel}
          onBlur={() => setLabelFocused(false)}
          onClick={focusLabel}
          className="absolute top-[50%] right-[10px] translate-y-[-50%]"
        >
          {inputSuffix}
        </span>
      </div>

      {helperText && (
        <p
          {...helperTextProps}
          className={`text-red-500 text-[.8rem] ${helperTextProps?.className}`}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export function PasswordTextField({ InputProps, ...props }: Props) {
  const [passwordView, setPasswordView] = useState<'hide' | 'show'>('hide')

  return (
    <TextField
      label={'Password'}
      {...props}
      InputProps={{
        placeholder: '*******',
        type: clsx(passwordView === 'hide' ? 'password' : 'text'),
        ...InputProps,
      }}
      inputSuffix={
        <span
          className={cn('text-[1.2rem] cursor-pointer text-gray-600')}
          onClick={() =>
            setPasswordView(passwordView === 'hide' ? 'show' : 'hide')
          }
        >
          {passwordView === 'show' ? <FaRegEye /> : <FaRegEyeSlash />}
        </span>
      }
    />
  )
}
