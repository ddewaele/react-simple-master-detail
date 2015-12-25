const BACKEND_URL_PREFIX = "https://web-gpio-react.herokuapp.com"

/*


Dropdown box showing a list of items (fetched through a reest call)
Upon selection from that dropdown, a detail pane needs to be rendered.
A seperate ret call is needed to fetch that detail data and populate the detail pane

Design options

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



/*

Represents our detail view. 
Should be rendered after we have made a selection from our dropdown.
To load up the detail, we need a seperate REST call (in this case executed during the onChange of the select element)
Some logic here in the render function to determine if we should render something (based on the this.props.board presence)

*/
var Board = React.createClass({

  render: function() {
    console.log(" ++ Board - render with props " + this.props);

    if (this.props.board) {
      return (
        <div className="board">
        <h1>{this.props.board.name}</h1>
        {this.props.board.imageUrl}
        </div>
        );

    } else {
      return (<div/>);
    }

  }
});


var BoardSelection = React.createClass({
  getInitialState: function() {
    return {};
  },

  // Here we load up all the items (consider this the master view). 
  // This is needed to populate the select item.
  loadAllBoards: function() {

    var component = this;

    $.get(BACKEND_URL_PREFIX + "/boards", function(boards) {
      console.log(" ++ BoardSelection - getting new data");
      component.setState({
        "boards":boards.boards
      });
      console.log("state set");
    });
  },

  // Upon selecting a board
  loadBoardDetails: function(boardName) {

    var component = this;

    $.get(BACKEND_URL_PREFIX + "/boards/" + boardName, function(board) {
      {{debugger}}
      console.log(" ++ BoardSelection - retrieved board data " + board);
      component.setState({"selectedBoard": board});
    });
  },

  // Keep in mind while doing the async ajax call, the rendering is still going on ....
  // Also, each call to setState triggers the render function, but not the componentDidMount function.
  componentDidMount: function() {
    console.log(" ++ BoardSelection - componentDidMount");
    this.loadAllBoards();
  },

  // When we select a board this function gets executed.
  // We load up the board details (causing the selectedBoard board state to change)
  changeBoard: function(event) {
    var boardName = event.target.value;
    this.loadBoardDetails(boardName);
  },

  render: function(){
    {{debugger}}
    console.log(" ++ BoardSelection - render");
    if (this.state.boards) {

      var boardOptions = this.state.boards.map(function(boardOption) {
        return (
          <BoardOption key={boardOption.name} value={boardOption.name} label={boardOption.name} />
          );
      });

      var board;

      if (this.state.selectedBoard) {
        board = (<Board board={this.state.selectedBoard} />);
      } else {
        board = (<div/>);
      }

      var selection = (
        <div>
          <div className="input-group">
            <span className="input-group-addon" id="sizing-addon2">Select a board</span>
            <select id="lang" className="form-control" onChange={this.changeBoard} value={this.state.selectedBoard} aria-describedby="sizing-addon2">
              <option value="select">Select</option>
              {boardOptions}
            </select>
          </div>
          {board}
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


ReactDOM.render(<BoardSelection />,document.getElementById('content'));
