import * as React from 'react'
const Marionette = require('marionette')

export const UnknownComponent = Marionette.LayoutView.extend({
  template() {
    return <div>Unknown component.</div>
  },
})

export class UnknownReactComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        let bigThing = []
        for (var i = 0; i<1000000; i++) {
            bigThing.push(1)
        }
        this.state = {
            bigThing
        }
      }
    render() {
      return <h1>Unknown React Component</h1>;
    }
  }