import React, { Component } from 'react';
import { Popup } from "react-mapbox-gl";
import { Marker } from "react-mapbox-gl";
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.sendGetRequest = this.sendGetRequest.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.postComment = this.postComment.bind(this)
    this.renderLayerpopups = this.renderLayerpopups.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.state = {
      pins: [],
      clickedMarker: { isClicked: false }
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

  postComment( evt){
    evt.preventDefault();
    console.log('Hello')
    console.log(document)
    console.log(document.getElementById('comment'))
    console.log(document.getElementById('comment').value)
    // console.log(evt)
    var forminput = document.getElementById('comment').value
    axios.post('/pins/update', {
      comment: forminput
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    })
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
      <form >
        <input id="comment" type="text" name="name"></input>
        <button onClick={this.postComment} type="submit">"Click Me"</button>
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

  render() {
    const allPins = this.state.pins.map((pin, index) => {
      console.log(pin)
      return this.renderMarker(pin.lng, pin.lat, index)
    })
    console.log(allPins)
    return (
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
    )
  }
}

export default App;
