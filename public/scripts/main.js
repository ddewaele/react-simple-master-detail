 const MASTERLISTITEM_SELECTION = "masterListItemSelection";

 var MasterPane = React.createClass({

 	render: function() {
 		return (
 			<div>
 			<MasterList masterListArray={masterListArray} />
 			<hr/>
 			<DetailPane/>
 			</div>
 		);
 	}
 });


 var MasterList = React.createClass({

 	getInitialState: function() {
 		return {selectedId: null};
 	},

 	selectItem: function(id) {
 		console.log("Selected item with id = " + id);
 		this.setState({selectedId:id});
 		CustomEvents.notify(MASTERLISTITEM_SELECTION, {selectedId:id});
 	},

 	render: function() {

 		var that = this;

 		var masterListItems = this.props.masterListArray.map(function(item) {
 			return (
 				<MasterListItem key={item.id} id={item.id} onClick={that.selectItem} selected={that.state.selectedId===item.id}>{item.name}</MasterListItem>
 			);
 		});

 		return (
 			<div>
 			<p>This is the master list.</p>
 			<ul>
 			{masterListItems}
 			</ul>
 			</div>
 		);
 	}
 
 });


var MasterListItem = React.createClass({

 	render: function() {

 		return (
 			<li onClick={this.props.onClick.bind(null,this.props.id)} style={{fontWeight: this.props.selected ? "bold" : "normal"}}>
 				{this.props.children} 
 			</li>
 		);
 	}

});

 var DetailPane = React.createClass({

 	getInitialState: function() {
 		return {selectedId: null};
 	},

 	componentDidMount: function() {

 		var that = this;
		CustomEvents.subscribe(MASTERLISTITEM_SELECTION, function(data) {
			that.setState({selectedId:data.selectedId});
		});

 	},

 	componentDidUnMount: function() {
		CustomEvents.unsubscribe(MASTERLISTITEM_SELECTION);
 	}, 	

 	render: function() {
 		return (
 			<div className="detailPane">
 				<p>This is the details pane.</p>

 				<div id="detailText"/>

 				<p>Selected item = {this.state.selectedId && this.state.selectedId} </p>
 			</div>
 		);
 	}
 });


var masterListArray = [

	{"id":1, "name":"test 1"},
	{"id":2, "name":"test 2"},
	{"id":3, "name":"test 3"}
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
