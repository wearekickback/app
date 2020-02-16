import React from 'react'
import styled from '@emotion/styled'
import Dropzone from 'react-dropzone'
import { Mutation } from 'react-apollo'

import { SINGLE_UPLOAD } from 'graphql/mutations'

const primary2 = `hsla(237, 75%, 72%, 1)`

const NoImage = styled('div')`
  color: white;
  background: ${primary2};
  max-width: 100%;
  height: 300px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 6px;
  box-shadow: 0 2px 0 hsla(0, 0%, 100%, 0.15)

  &:hover {
    cursor: pointer;
  }
`

const ImageWrapper = styled('div')`
  display: flex;
  border-radius: 6px;

  &:before {
    content: "${p => p.text}";
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: 0.2s;
    position: absolute;
    left: 0;
    top: 0;
    color: white;
    width: 100%;
    height: 100%;
    background: rgba(110, 118, 255, 0.85);
    box-shadow: 0 2px 0 hsla(0, 0%, 100%, 0.15)
  }
  &:hover {
    cursor: pointer;
    &:before {
      opacity: 1;
    }
  }
`

const DropZoneWrapper = styled('div')`
  margin-bottom: 20px;
`

const UploadedImage = ({ src, text }) => (
  <ImageWrapper text={text}>
    <img alt="event" src={src} />
  </ImageWrapper>
)

const InputImage = ({ image, uploading, onDrop }) => {
  return (
    <DropZoneWrapper>
      <Mutation mutation={SINGLE_UPLOAD}>
        {mutate => (
          <Dropzone
            className="dropzone"
            onDrop={files => onDrop(files, mutate)}
            accept="image/*"
          >
            {image ? (
              <UploadedImage
                src={image}
                text="Click or drop a file to change photo"
              />
            ) : (
              <NoImage>
                {uploading
                  ? 'Uploading...'
                  : 'Click or drop a file to change photo'}
              </NoImage>
            )}
          </Dropzone>
        )}
      </Mutation>
    </DropZoneWrapper>
  )
}

export default InputImage
