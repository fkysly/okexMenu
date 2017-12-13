const {app, Menu, Tray} = require('electron')
const WebSocket = require('ws')

let tray = null
app.on('ready', () => {
  tray = new Tray('/Users/matianyi/work/okexmenu/app/logo.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', type: 'normal', click: () => {
      app.quit()
    }}
  ])
  tray.setTitle('')
  tray.setContextMenu(contextMenu)

  okex((price) => {
    tray.setTitle("iota: " + price)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function okex(callback) {
  let ws = new WebSocket('wss://real.okex.com:10440/websocket/okexapi')
  ws.on('open', () => {
    ws.send("{'event':'addChannel','channel':'ok_sub_spot_iota_usdt_ticker'}")
  })
  
  ws.on('message', (msg) => {
    try {
      var data = JSON.parse(msg)
      data = data[0].data
      if (data.last) {
        let price = data.last
        callback(price)
      }
    } catch (e) {
    }
  })
  
  ws.on('close', () => {
    okex(callback)
  })
}
