'use client'
import React from 'react'
import styled from 'styled-components'

const CustomShareButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <StyledWrapper>
      <button type="button" className="share-button" onClick={onClick}>
        <span className="button__text">Share</span>
        <span className="button__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 134 134"
            className="svg"
          >
            <circle strokeWidth={13} stroke="white" r="20.5" cy={27} cx={107} />
            <circle
              strokeWidth={13}
              stroke="white"
              r="20.5"
              cy={107}
              cx={107}
            />
            <circle strokeWidth={13} stroke="white" r="20.5" cy={67} cx={27} />
            <line
              strokeWidth={13}
              stroke="white"
              y2="36.1862"
              x2="88.0931"
              y1="56.1862"
              x1="48.0931"
            />
            <line
              strokeWidth={13}
              stroke="white"
              y2="97.6221"
              x2="89.0893"
              y1="78.1486"
              x1="48.8304"
            />
          </svg>
        </span>
      </button>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .share-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 120px;
    height: 40px;
    position: relative;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid #81aca0;
    background-color: rgba(84, 107, 47, 0.6);
    opacity: 0.9;
    overflow: hidden;
    cursor: pointer;
    color: white;
  }
  .button__text {
    width: 80px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .button__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;

    justify-content: center;
    background-color: #546b2f;
    position: absolute;
    right: 0;
    transition: all 0.3s;
  }
  .button__icon svg {
    width: 15px;
  }
  .share-button:hover .button__icon {
    width: 100%;
  }
`

export default CustomShareButton
