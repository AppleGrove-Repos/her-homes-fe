export const dropdownVariant = {
  hidden: {
    opacity: 0,
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  arrowClosed: {
    rotate: 0,
  },
  arrowOpen: {
    rotate: 180,
  },
}

export const opacityVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
