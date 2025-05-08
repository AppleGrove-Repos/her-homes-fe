'use client'
import { cn } from '@/lib/utils/utils'
import { AnimatePresence, Variant, motion } from 'framer-motion'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { dropdownVariant } from '@/lib/utils/variants'
import Loader from '../loaders'
import { MdClose } from 'react-icons/md'

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

type Option = {
  label: string | ReactNode
  value: any
  id: string
}

interface Props {
  data?: Option[]
  value?: string
  onClear?(): void
  onSelect?(option: Option): void
  onSearch?(search?: string): Option[]
  loading?: boolean
  className?: string
  disabled?: boolean
  placeholder?: string
  showDropDownSuffix?: string
  label?: string
  helperText?: string
}

const SelectField: FC<Props> = ({
  data,
  value,
  onClear,
  onSelect,
  loading,
  onSearch,
  className,
  disabled,
  placeholder,
  showDropDownSuffix = true,
  label,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<Option[]>(data ?? [])
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    undefined
  )
  const [search, setSearch] = useState<string>('')
  const [labelFocused, setLabelFocused] = useState<boolean>(false)

  const focusLabel = () => {
    setLabelFocused(true)
    setIsOpen(true)
  }

  useEffect(() => {
    if (data) {
      setOptions(data)
    }
  }, [data])

  useEffect(() => {
    if (onSearch) {
      const options = onSearch?.(search)
      setOptions(options)
    }
  }, [search])

  return (
    <div className={cn('relative w-[200px]', className)}>
      <div>
        <header
          className={cn(
            'bg-white border-b border-gray-600 focus:border-primary py-[9px] flex items-center h-full',
            helperText && 'border-b-red-500',
            (labelFocused || isOpen) && 'border-b-2'
          )}
        >
          <AnimatePresence>
            {label && (
              <motion.label
                className={cn(
                  `font-normal absolute top-0 left-0 text-primary text-[.9rem]`,
                  helperText && '!text-red-500'
                )}
                variants={labelVariants}
                animate={
                  labelFocused || isOpen || value ? 'focused' : 'unfocused'
                }
              >
                {label}
              </motion.label>
            )}
          </AnimatePresence>

          <input
            onFocus={focusLabel}
            onBlur={() => (setLabelFocused(false), setIsOpen(false))}
            className="bg-white outline-none border-none placeholder:text-[.9rem] text-[.9rem] text-[#444] flex-1 w-full"
            placeholder={
              value ||
              (!labelFocused && label ? label : placeholder) ||
              'Select...'
            }
            value={search}
            onChange={(e) => {
              setIsOpen(true)
              setSearch(e.target.value)
              focusLabel()
            }}
          />

          {(value || search) && (
            <span
              className="inline-block ml-2 cursor-pointer"
              onClick={() => {
                onClear?.()
                setSearch('')
                setSelectedOption(undefined)
              }}
            >
              <MdClose size={20} className="text-black" />
            </span>
          )}

          {showDropDownSuffix && (
            <>
              <motion.span
                variants={dropdownVariant}
                initial="arrowClosed"
                animate={isOpen ? 'arrowOpen' : 'arrowClosed'}
                className="min-w-fit cursor-pointer"
                onClick={() => {
                  if (!disabled) {
                    setIsOpen((prev) => !prev)
                  }
                }}
              >
                <BiChevronDown size={20} className="text-black" />
              </motion.span>
            </>
          )}
        </header>
        {helperText && (
          <p className={`text-red-500 text-[.8rem]`}>{helperText}</p>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute bg-white shadow-md w-full z-[20] max-h-[200px] overflow-y-scroll"
          >
            {loading && (
              <div className="max-w-fit mx-auto">
                <Loader size={25} />
              </div>
            )}

            {options?.map((d, index) => {
              return (
                <Option
                  key={index + crypto.randomUUID()}
                  option={d}
                  index={index}
                  selectedId={selectedOption?.id}
                  onSelect={(option) => {
                    setSelectedOption(option)
                    setIsOpen(false)
                    onSelect?.(option)
                    setSearch('')
                  }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface OptionsProps {
  option: Option
  index?: number
  selectedId?: Option['id']
  onSelect: Props['onSelect']
}

export const Option: FC<OptionsProps> = ({
  option,
  index,
  selectedId,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState<boolean>(false)

  useEffect(() => {
    if (selectedId && option?.id?.toString() === selectedId.toString()) {
      ref.current?.focus()
      setFocused(true)
    } else if (!selectedId && index == 0) {
      ref.current?.focus()
      setFocused(true)
    } else {
      setFocused(false)
    }
  })

  return (
    <div
      ref={ref}
      onClick={() => onSelect?.(option)}
      className={cn(
        'p-2 !text-[.85rem] cursor-pointer',
        focused && 'bg-primary text-white',
        !focused && 'hover:bg-primary/5'
      )}
    >
      {typeof option?.label == 'string' ? (
        <p className="text=[.85rem]">{option.label}</p>
      ) : (
        option.label
      )}
    </div>
  )
}

export default SelectField
