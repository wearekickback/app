import styled from '@emotion/styled'

const Status = styled('div')`
  ${({ type }) => {
    switch (type) {
      case 'contributed':
        return `
        color: #ffac32;
        background-color: #FEF6EB;
      `
      case 'won':
        return `
        color: #5cca94;
        background-color: #e7f7ef;
      `
      case 'lost':
        return `
        color: #6E76FF;
        background-color: #F4F5FF;
      `
      case 'marked':
        return `
        color: #6e76ff;
        background-color: rgba(233, 234, 255, 0.5);
        border: 1px solid rgba(233, 234, 255, 0.5);
      `
      default:
        return `
        color: #ccc;
        background-color: rgba(233, 234, 255, 0.5);
        border: 1px solid rgba(233, 234, 255, 0.5);
      `
    }
  }} font-size: 12px;
  padding: 5px;
  border-radius: 4px;
  text-align: center;
  display: flex;
`

export default Status
