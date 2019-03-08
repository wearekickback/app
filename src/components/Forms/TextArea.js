import styled from 'react-emotion'

const TextArea = styled('textarea')`
  width: 400px;
  font-size: 14px;
  padding: 10px;
  width: 100%;
  border-radius: 2px;
  border: 1px solid #edeef4;
  padding-left: 20px;
  &:focus {
    outline: 0;
    border: 1px solid #6e76ff;
  }

  ::placeholder {
    color: #ccced8;
    opacity: 1; /* Firefox */
  }
`

export default TextArea
