import React, {Component} from "react";

import './Skeleton.css';

class Skeleton extends Component {
  render() {
    return (
      <div className={this.props.noBorder ? ('skeleton-no-border') : ('skeleton')}>
        <ul>
          <li className='skeleton-heading'></li>
          <li></li>
        </ul>
      </div>
    )
  }
}

export default Skeleton;
