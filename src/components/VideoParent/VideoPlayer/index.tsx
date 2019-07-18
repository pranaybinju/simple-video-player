import React from 'react';
import { IVideoObject } from '../../VideoParent';
import { Button } from 'reactstrap';
interface Props {
  currentVideo: IVideoObject;
  toggleStatus: () => void;
  changeCurrentTime: (currentTime: any) => void;
  setDuration: (videoDuration: any) => void;
}

interface State {
  volume: number;
}

class VideoPlayer extends React.Component<Props, State> {
  video: any;
  slider: any;
  volumeSlider: any;
  constructor(props: Props) {
    super(props);
    // create a ref to store the  DOM elements
    this.video = React.createRef();
    this.slider = React.createRef();
    this.volumeSlider = React.createRef();
  }
  state: State = {
    volume: 0.5
  };
  componentDidMount() {
    if (!this.video.current) return;
    else {
      if (this.props.currentVideo.status) {
        this.video.current.play();
      } else {
        this.video.current.pause();
      }
    }
  }
  componentDidUpdate() {
    if (!this.video.current) return;
    if (this.props.currentVideo.status) {
      this.video.current.play();
    } else {
      this.video.current.pause();
    }
  }
  setVideoDuration = () => {
    //duration of video is set when browser is ready to play the video,onCanPlay event
    this.props.setDuration(this.video.current.duration);
  };
  setCurrentTime = (e: any) => {
    // change currentTime of video when slider changes or onTimeUpdate event of video
    if (e.target.type === 'range') {
      this.props.changeCurrentTime(this.slider.current.value);
      this.video.current.currentTime = this.slider.current.value;
    } else {
      this.props.changeCurrentTime(this.video.current.currentTime);
    }
  };

  setVolume = (e: any) => {
    if (e.target.type === 'range') {
      this.setState(
        { volume: parseFloat(this.volumeSlider.current.value) },
        () => {
          this.video.current.volume = parseFloat(
            this.volumeSlider.current.value
          );
        }
      );
    } else {
      this.video.current.volume = this.state.volume;
    }
  };

  render() {
    if (this.props.currentVideo.source.trim() !== '') {
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <video
              width="500px"
              height="200px"
              src={this.props.currentVideo.source}
              ref={this.video}
              onCanPlay={e => {
                this.setVideoDuration();
                this.setVolume(e);
              }}
              onTimeUpdate={e => this.setCurrentTime(e)}
            />
            {this.props.currentVideo.status ? (
              <>
                <button onClick={this.props.toggleStatus}>Pause</button>
                <div className="slidecontainer">
                  <input
                    type="range"
                    ref={this.slider}
                    min="0"
                    max={this.props.currentVideo.duration.toString()}
                    value={this.props.currentVideo.currentTime.toString()}
                    step="1"
                    onChange={e => this.setCurrentTime(e)}
                  />
                </div>
                <div className="volumeSlider">
                  <input
                    type="range"
                    ref={this.volumeSlider}
                    min="0.0"
                    max="1.0"
                    value={this.state.volume}
                    step="0.1"
                    onChange={this.setVolume}
                  />
                </div>
              </>
            ) : (
              <>
                <button onClick={this.props.toggleStatus}>Play</button>
                <div className="slidecontainer">
                  <input
                    type="range"
                    min="0"
                    ref={this.slider}
                    max={this.props.currentVideo.duration.toString()}
                    value={this.props.currentVideo.currentTime.toString()}
                    id="myRange"
                    step="1"
                    onChange={e => this.setCurrentTime(e)}
                  />

                  <div className="volumeSlider">
                    <input
                      type="range"
                      ref={this.volumeSlider}
                      min="0.0"
                      max="1.0"
                      value={this.state.volume}
                      step="0.1"
                      onChange={this.setVolume}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      );
    }
    return <>Click to play Video</>;
  }
}
export default VideoPlayer;
