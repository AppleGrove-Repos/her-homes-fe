'use client'

import type React from 'react'

import { opacityVariant } from '@/lib/utils/variants'
import { motion } from 'framer-motion'
import { type FC, useEffect, useRef } from 'react'
import { IoMdClose } from 'react-icons/io'

const variant = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: 'easeInOut',
      type: 'spring',
      damping: 15,
      duration: 0.5,
    },
  },
  exit: { opacity: 0, scale: 0 },
}

type ModalProps = {
  isOpen?: boolean
  onClose: () => void
  isAutomatic?: boolean
  showCloseButton?: boolean
  closeButtonClass?: string
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

const Modal: FC<ModalProps> = ({
  children,
  isOpen = true,
  onClose,
  isAutomatic = true,
  showCloseButton,
  closeButtonClass = '',
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('click', handleOutsideClick)
      document.body.style.overflowY = 'hidden'
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick)
      document.body.style.overflowY = 'auto'
    }
  }, [isOpen, onClose])

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 min-w-full min-h-full flex justify-center items-center z-[3000] overflow-hidden">
          {/* background */}
          <motion.div
            {...opacityVariant}
            className="fixed top-0 left-0 min-w-full min-h-full bg-black/20 backdrop-blur-md flex items-center justify-center"
            onClick={isAutomatic ? onClose : () => {}}
          ></motion.div>

          {/* modal */}
          <motion.div
            {...variant}
            className="md:max-h-3/4 mx-auto w-[96%] sm:w-fit max-w-[96%] sm:min-w-[30rem] relative z-[300]"
          >
            <div ref={ref} {...rest}>
              {children}
            </div>
          </motion.div>

          {/* close button */}
          {!!showCloseButton && (
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={onClose}
            >
              <IoMdClose className={closeButtonClass} size={34} />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Modal
