'use strict';

import React from'react/addons';
import ChannelActions from 'actions/ChannelActions';
import File from 'components/File';
import {getHumanReadableBytes} from '../utils/utils.js';
import 'styles/Directory.scss';

var TransitionGroup = React.addons.CSSTransitionGroup;

class Directory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      hash: props.hash,
      link: null,
      size: props.size,
      children: [],
      open: false,
      loading: true
    };
  }

  componentDidMount() {
    ChannelActions.loadDirectoryInfo(this.props.hash, (objects) => {
      this.setState({ children: objects, loading: false });
    });
  }

  openDirectory(e) {
    e.preventDefault();
    this.setState({open: !this.state.open});
    return;
  }

  render() {
    // var downloadLink = apiURL + this.state.link + "?name=" + this.state.name + "&action=download";
    var size     = getHumanReadableBytes(this.state.size);
    var style    = this.state.loading ? "Directory loading" : "Directory";
    var children = [];
    var name     = (
      <TransitionGroup transitionName="directoryAnimation" transitionAppear={true}>
        <a href="" onClick={this.openDirectory.bind(this)}>{this.state.name}</a>
      </TransitionGroup>
    );

    if(this.state.children && this.state.open) {
      children = this.state.children.map((e) => {
        return e.type === "file" ?
          <File hash={e.hash} name={e.name} size={e.size} key={e.hash}/> :
          <Directory hash={e.hash} name={e.name} size={e.size} key={e.hash}/>;
      });
    }

    // <a className="download" href={downloadLink} target="_blank">Download</a>
    return (
      <div className="DirectoryView">
        <span className="Directory">
          {name}
          <span className="size">{size}</span>
        </span>
        <div className={children.length > 0 ? "children" : ""}>{children}</div>
      </div>
    );
  }

}

export default Directory;
