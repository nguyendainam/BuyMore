import * as React from 'react'
import { Spin } from 'antd'
import * as ReactDOM from 'react-dom'

export class ShowLoading {
  public static show(idShowLoad?: string) {
    const ShowLoadingID = idShowLoad || 'loading-spinner'
    const container = document.createElement('div')
    container.id = ShowLoadingID
    container.setAttribute(
      'style',
      'position: fixed ; top:0 ; left: 0; width: 100%; height: 100% ; background:#FFFFF ;opacity: 0.5'
    )
    document.body.appendChild(container)
    const loadingEle: React.ReactElement = React.createElement(Spin, {
      size: 'large',
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%'
      }
    })

    ReactDOM.render(loadingEle, container)
  }

  public static hide() {
    const container = document.getElementById('loading-spinner')
    if (container) {
      container.remove()
    }
  }
}
