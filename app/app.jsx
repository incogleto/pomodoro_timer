import React from 'react';
import ReactDOM from 'react-dom';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './../app/style.css';

class Pomodoro extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      sSeconds: 1500,
      bSeconds: 300,
      isSession: true,
      isPlaying: false
    }
    this.timer = 0;
    this.countDown = this.countDown.bind(this);
  }
  componentDidMount(){
   this.audio = document.getElementById("beep"); 
  }
  incrementSession(x){
    var session = this.state.sessionLength += x;
    if(session < 1)
      session = 1;
    if(session > 60)
      session = 60;
    this.setState({
      sessionLength: session,
      sSeconds: session * 60
    });
  }
  incrementBreak(x){
    var breakL = this.state.breakLength += x;
    if(breakL < 1)
      breakL = 1;
    if(breakL > 60)
      breakL = 60;
    this.setState({
     breakLength: breakL,
      bSeconds: breakL * 60
    });
  }
  reset(){
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      sSeconds: 1500,
      bSeconds: 300,
      isSession: true,
      isPlaying:false
    })
    clearInterval(this.timer);
    this.timer = 0;
    this.audio.pause();
    this.audio.currentTime = 0;
  }
  play_pause(){
    if(this.state.isPlaying){
      clearInterval(this.timer);
      this.timer = 0;
    }
    else{
      this.startTimer();
    }
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }
  startTimer(){
    if(this.timer == 0){
      this.timer = setInterval(this.countDown, 1000);
    }
  }
  countDown(){
    if(this.state.isSession){
      var seconds = this.state.sSeconds - 1;
      this.setState({
        sSeconds: seconds,
      });
    }
    else{
      var seconds = this.state.bSeconds - 1;
      this.setState({
        bSeconds: seconds,
      });
    }
    
    if (seconds < 0) { 
      this.playSound();
      this.setState({
        isSession: !this.state.isSession,
        bSeconds: this.state.breakLength * 60,
        sSeconds: this.state.sessionLength * 60
      })
    }
  }
  secondsToTime(secs){
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    minutes = minutes.toString().padStart(2, '0');

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    seconds = seconds.toString().padStart(2, '0');

    let obj = {
      "m": minutes,
      "s": seconds
    };
    return obj;
  }
  playSound(){
    this.audio.play();
  }
  render(){
    if(this.state.isSession){
      var time = this.secondsToTime(this.state.sSeconds);
      var percentage = (1 - ((this.state.sSeconds)/(this.state.sessionLength * 60)))* 100;
    }
    else{
      var time = this.secondsToTime(this.state.bSeconds);
      var percentage = (1 - ((this.state.bSeconds)/(this.state.breakLength * 60)))* 100;
    }
    return (
      <div id="pomodoro">
        <div id="settings">
          <div id="break-label" class="setting-label">Break Length</div>
          <div id="break-panel" class="setting-panel">
            <div id="break-decrement" onClick={()=>this.incrementBreak(-1)}><i class="fas fa-arrow-down"></i></div>
            <div id="break-length">{this.state.breakLength}</div>
            <div id="break-increment" onClick={()=>this.incrementBreak(1)}><i class="fas fa-arrow-up"></i></div>
          </div>
          <div id="session-label" class="setting-label">Session Length</div>
          <div id="session-panel" class="setting-panel">
            <div id="session-decrement" onClick={()=>this.incrementSession(-1)}><i class="fas fa-arrow-down"></i></div>
            <div id="session-length">{this.state.sessionLength}</div>
            <div id="session-increment" onClick={()=>this.incrementSession(1)}><i class="fas fa-arrow-up"></i></div>
          </div>
        </div>
        <div id="timer-label">{this.state.isSession ? 'Session' : 'break'}</div>
        <CircularProgressbar 
          percentage={percentage} 
          text={(<tspan><tspan id="timer-label" x="50px" dy="-.4em">{this.state.isSession ? 'Session' : 'break'}</tspan><tspan id="time-left" x="50px" dy="1em">{time.m}:{time.s}</tspan></tspan>)}
          styles={{
            text: { fontSize: '16px'},
          }} />
        <div id="controls">
          <div id="start_stop" onClick={()=>this.play_pause()}>
            <i class={this.state.isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
          </div>
          <div id="reset" onClick={()=>this.reset()}><i class="fas fa-undo"></i></div>
        </div>
        <audio class="beep" id="beep" preload="auto" src="https://cdn.glitch.com/0944122e-96d0-44a7-85ca-530019d7d628%2FAlarm%20Clock-SoundBible.com-437257341.wav?1535396602469"></audio>
      </div>
      
    )
  }
}

ReactDOM.render(<Pomodoro />, document.getElementById('app'));