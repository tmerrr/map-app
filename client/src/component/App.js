import React, { Component } from 'react';
import { Popup } from "react-mapbox-gl";
import { Marker } from "react-mapbox-gl";
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.sendGetRequest = this.sendGetRequest.bind(this)
    this.renderPopup = this.renderPopup.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.renderLayerpopups = this.renderLayerpopups.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.toggleDropPin = this.toggleDropPin.bind(this)

    this.state = {
      pins: [],
      clickedMarker: { isClicked: false },
      isDropPin: { on: false }
    }
  }

  componentDidMount() {
    this.sendGetRequest();
  }

  sendGetRequest() {
    let pinsArray = this.state.pins.slice()
    axios.get('/pins')
    .then((response) => {
      response.data.map((pin) => pinsArray.push({
        lng: pin.longitude, lat: pin.latitude
      }))
      this.setState({
        pins: pinsArray
      })
      console.log(this.state)
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  renderLayerpopups(){
    console.log('hello Dania Mah')
    this.setState({
      clicked: true
    })
  }

  renderPopup(){
    return(
    <Popup
    coordinates={[-0.2416815, 51.5285582]}
    offset={{
      'bottom-left': [12, -38], 'bottom': [0, -38], 'bottom-right': [-12, -38]
    }}>
    <form>
      <input type="text" name="name"></input>
      <input type="submit" value="Click Me Bitches"></input>
    </form>
  </Popup> )
  }

  showPopup(lng, lat) {
    console.log(lng, lat)

    return(
      <Popup
      coordinates={[lng, lat]}
      offset={{
        'bottom-left': [12, -38], 'bottom': [0, -38], 'bottom-right': [-12, -38]
      }}
    >
      <form>
        <input type="text" name="name"></input>
        <input type="submit" value="Click Me Bitches"></input>
      </form>
    </Popup>
  )
  }

  handlePopupClick(lng, lat) {
    this.setState({
      clickedMarker: {isClicked: true, lng: lng, lat: lat}
    })
  }

  renderMarker(lng, lat, index){
    return (
      <Marker
        key={index}
        coordinates={[lng, lat]}
        onClick={() => this.handlePopupClick(lng, lat)}
        anchor="bottom"
      >
        <img src={"1.png"} alt="pin" style={{"width": "60px"}}/>
      </Marker>
    )
  }

  handleClick(map, evt) {
    this.setState({
      clickedMarker: { isClicked: false }
    })
    if (this.state.isDropPin.on ) {
      let pinsArray = this.state.pins.slice()
      pinsArray.push(evt.lngLat)
      this.setState({
        pins: pinsArray
      })
      axios.post('/pins/new', {
        longitude: evt.lngLat.lng,
        latitude: evt.lngLat.lat
      })
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      });
    }
  }

  toggleDropPin() {
    console.log('Toggled')
    let newDropPinStatus = this.state.isDropPin.on ? false : true;
    this.setState({
      isDropPin: { on: newDropPinStatus }
    });
  }

  render() {
    const allPins = this.state.pins.map((pin, index) => {
      console.log(pin)
      return this.renderMarker(pin.lng, pin.lat, index)
    })
    console.log(allPins)
    return (
      <div>
        <button name="dropPinToggle" onClick={this.toggleDropPin}>Drop Pin</button>
        <this.props.MapClass
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
          onClick={this.handleClick}
          >
            {allPins}
            <this.props.GeocoderClass />
            {this.state.clickedMarker.isClicked ? this.showPopup(this.state.clickedMarker.lng, this.state.clickedMarker.lat) : null}
          </this.props.MapClass>

      </div>
    )
  }
}

export default App;
