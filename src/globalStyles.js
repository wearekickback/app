import { injectGlobal } from "emotion"

injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    color: #3D3F50;
    font-family: Muli;
  }

  a {
    color: #6E76FF;
    text-decoration: none;
  }

  ul {
    padding: 0;
  }

  img {
    max-width: 100%;
  }
`
