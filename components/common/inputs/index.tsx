'use client'
import { cn } from '@/lib/utils/utils'
import { AnimatePresence } from 'framer-motion'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { motion } from 'framer-motion'
import { dropdownVariant } from '@/lib/utils/variants'
import Loader from '../loaders'
import { MdClose } from 'react-icons/md'

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
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<Option[]>(data ?? [])
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    undefined
  )
  const [search, setSearch] = useState<string>('')

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
      <header className="bg-white border-2 border-gray-600 focus:border-mainLight p-2 flex items-center h-full">
        <input
          className="bg-white outline-none border-none placeholder:text-[.8rem] text-[.8rem] text-[#444] flex-1 w-full"
          placeholder={value || placeholder || 'Select...'}
          value={search}
          onChange={(e) => {
            setIsOpen(true)
            setSearch(e.target.value)
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
            <MdClose size={20} className="text-[#444]" />
          </span>
        )}

        {showDropDownSuffix && (
          <>
            <div className="w-[1.5px] h-[15px] mx-2 bg-gray-600" />
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
              <BiChevronDown size={20} className="text-[#444]" />
            </motion.span>
          </>
        )}
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute bg-white shadow-md w-full z-[20]"
          >
            {loading && <Loader size={20} />}

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
        focused && 'bg-mainLight text-white',
        !focused && 'hover:bg-mainExtraLight'
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
