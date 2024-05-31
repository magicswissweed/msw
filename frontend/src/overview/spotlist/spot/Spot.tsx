import './Spot.scss'
import {Component} from 'react';

interface SpotProps {
  location: number
}

export class Spot extends Component<{ location: Number }> {

  private readonly location: number;

  constructor(props: SpotProps) {
    super(props);
    this.location = props.location;
  }

  render() {
    return <>
      <p>{this.location}</p>
    </>;
  }
}