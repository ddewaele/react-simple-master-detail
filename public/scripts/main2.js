 const MASTERLISTITEM_SELECTION = "masterListItemSelection";
 const BACKEND_URL_PREFIX = "https://arcane-ridge-1203.herokuapp.com/boards"

/*


Dropdown box showing a list of items (fetched through a reest call)
Upon selection from that dropdown, a detail pane needs to be rendered.
A seperate ret call is needed to fetch that detail data and populate the detail pane


Deign options

a) selection component maintains all state

Does the detail pane have state ?
Should the dropdown box handle 
  - rendering the list
  - modelling the selection as state
  - do the rest call to fetch the details
  - simply pass on the detail object to the detail pane as a property

b) both components maintain some state 

The  detail pane handles
  - fetching the detail itself (based on an ID passed through as a property)
  - how will it be triggered to reRender itself ?
  - where will the data fetching happen for that detail pane ?
  - maintain state (the detail itself)

*/


var Board = React.createClass({

  getInitialState: function() {
    return {board:null};
  },

  componentDidMount: function() {
    console.log(" ++ Board - componentDidMount");
    var component = this;

    CustomEvents.subscribe(BOARD_SELECTION, function(data) {
      console.log(" ++ Board - BOARD_SELECTION received");
      
        $.get(BACKEND_URL_PREFIX + "/boards/" + data.board, function(board) {
          {{debugger}}
            component.setState({"board" : board});
            console.log("Found board " + board.name);
        });


    });

  },

  componentWillUnmount: function() {
    CustomEvents.unsubscribe(BOARD_SELECTION);
  },    

  render: function() {
    {{debugger}}
    console.log(" ++ Board - render");

    if (this.state.board) {
      return (
        <div className="parent">
          <div className="board">

            <h1>{this.props.boardConfig.name}</h1>

            <DetailPane apiPath={this.props.apiPath}/>

            <div className="boardcontainer">
              <GpioDivList boardConfig={this.props.boardConfig}/>
              <img src={this.props.boardConfig.imageUrl}/>
            </div>
          </div>

        </div>
      );

    } else {

      return (<div>Loading board....</div>);
    }
  }
 });


var BoardSelection = React.createClass({


  getInitialState: function() {
    return {};
  },
     // Keep in mind while doing the async ajax call, the rendering is still going on ....
     // Also, each call to setState triggers the render function
     componentDidMount: function() {

    console.log(" ++ BoardSelection - componentDidMount");
      var component = this;
      
      $.get(BACKEND_URL_PREFIX + "/boards", function(boards) {
        console.log(" ++ BoardSelection - getting new data");
          component.setState({
            "boards":boards.boards,
            "selectedBoard":boards.boards[0].name
          });
          console.log("state set");
      });

     },

     change: function(event){
    console.log(" ++ BoardSelection - change ... sending event");
         this.setState({selectedBoard: event.target.value});
         CustomEvents.notify(BOARD_SELECTION, {board:event.target.value});
     },

     render: function(){
      console.log(" ++ BoardSelection - render");
    if (this.state.boards) {

        var boardOptions2 = this.state.boards.map(function(boardOption) {
        return (
          <BoardOption key={boardOption.name} value={boardOption.name} label={boardOption.name} />
        );
      });

          var selection = (
             <div>
             <div className="input-group">
            <span className="input-group-addon" id="sizing-addon2">Select a board</span>
                 <select id="lang" className="form-control" onChange={this.change} value={this.state.selectedBoard} aria-describedby="sizing-addon2">
                    <option value="select">Select</option>
                {boardOptions2}
                 </select>
              </div>
                  <Board apiPath="/udooneorest" boardName={this.state.selectedBoard} boardConfig={this.props.boardOptions[this.state.selectedBoard]}/>
             </div>
          );

          return selection;

      } else {

        return (<div>"Loading boards...."</div>);
      }
     }


});

var BoardOption = React.createClass({
  render: function() {
    return (
      <option value={this.props.value}>{this.props.label}</option>
    );
  }
});

var masterListArray = [

	{"id":1, "name":"test 1", "detail":"this is the detail for test 1"},
	{"id":2, "name":"test 2", "detail":"this is the detail for test 2"},
	{"id":3, "name":"test 3", "detail":"this is the detail for test 3"}
];


var CustomEvents = (function() {
  var _map = {};

  return {
    subscribe: function(name, cb) {
      _map[name] || (_map[name] = []);
      _map[name].push(cb);
    },

    unsubscribe: function(name) {
    	delete _map[name];
    },

    notify: function(name, data) {
      if (!_map[name]) {
        return;
      }

      // if you want canceling or anything else, add it in to this cb loop
      _map[name].forEach(function(cb) {
        cb(data);
      });
    }
  }
})();

ReactDOM.render(<MasterPane />,document.getElementById('content'));
