

// QuadTree used for collision detection
var QuadTreeNode = function(bounds, depth, maxChildren, maxDepth){
  this.children = {}

/*  {*/
    //nw: undefined,
    //ne: undefined,
    //sw: undefined,
    //se: undefined
  /*}*/

  this.bounds = bounds;
  this.depth = depth;
  this.players = []; // players in this quadrant
  this.maxChildren = maxChildren;
  this.maxDepth = maxDepth;
}


var QuadTree = function(bounds, maxChildren, maxDepth) {
  this.maxChildren = maxChildren;
  this.maxDepth = maxDepth;
  this.bounds = bounds;
  this.root = new QuadTreeNode(bounds, 0, maxChildren, maxDepth);
  
}

function testBounds() {

}

QuadTree.prototype.findQuadrant = function(player, parent) {
  console.log('inside find quadrant');
  console.log(player);
  console.log(parent.children);

  // this is the correct node (it has no nw child, therefore it has no children -- crappy check, but it should work for now. TODO: later)
  if(parent.children.nw === undefined) {
    console.log("did not have any children");
    return parent;
  }

  for(var i in parent.children) {
    var child = parent.children[i];
      console.log("child:");
      console.log(child);
      console.log("player:")
      console.log(player);
    // if you have children, then you have to go further down. Check which child to traverse to. WRITE RECURSIVELY
    if(player.x >= child.bounds.left && player.x <= child.bounds.right && player.y >= child.bounds.top && player.y <= child.bounds.bottom) {
      //call it on the child
      return this.findQuadrant(player, child);
    }
  }
      console.log("shouldn't reach here");
}


QuadTree.prototype.printTree = function() {
  var helper = function(node) {
    console.log("\nMax Children: " + node.maxChildren);
    console.log("\nMax Depth: " + node.maxDepth);
    console.log("\nDepth: " + node.depth);
    console.log("\nPlayers: \n");

    for(var p in node.players) {
      console.log("\n");
      console.log(p);
    }
    for(var c in node.children) {
      console.log("\n" + c + ": ");
      this.helper(c);
    }
  }
  helper(this.root);
}
  
QuadTree.prototype.insert = function(player) {

  console.log(this);
  console.log(this.prototype);
  var parent = this.findQuadrant(player, this.root);
  console.log(parent);
  console.log(this.root);

  console.log(player);

  console.log("Testing children");
  console.log(parent);
  console.log(parent.maxChildren);
  // if parent has less than the max amount of children, then insert as a leaf, returns the result node
  // OR, if parent is already at max depth
  if (parent.players.length < parent.maxChildren || parent.depth === parent.maxDepth) {
    console.log("Should push to current node now");
    console.log("Current node: ");
    console.log(parent);
    parent.players.push(player);
    return parent;
  }
  // otherwise you need to create four new children nodes, and move players around into new
  else {
    console.log("Creating new children");
    var player_bounds = {
      left: player.x,
      right: player.x, 
      top: player.y,
      bottom: player.y
    }
    var p_bounds = parent.bounds;
    var y_axis =  Math.floor(p_bounds.left + (p_bounds.right - p_bounds.left) / 2);
    var x_axis =  Math.floor(p_bounds.top + (p_bounds.bottom - p_bounds.top) / 2);

    parent.children.nw = new QuadTreeNode({ left: p_bounds.left, right: y_axis - 1, top: p_bounds.top, bottom: x_axis - 1 },
                                 parent.depth + 1, parent.maxChildren, parent.maxDepth);
    parent.children.ne = new QuadTreeNode({ left: y_axis, right: p_bounds.right, top: p_bounds.top, bottom: x_axis - 1 }, 
                                 parent.depth + 1, parent.maxChildren, parent.maxDepth);
    parent.children.sw = new QuadTreeNode({ left: p_bounds.left, right: y_axis - 1, top: x_axis, bottom: p_bounds.bottom },
                                 parent.depth + 1, parent.maxChildren, parent.maxDepth);
    parent.children.se = new QuadTreeNode({ left: y_axis, right: p_bounds.right, top: x_axis, bottom: p_bounds.bottom },  
                                 parent.depth + 1, parent.maxChildren, parent.maxDepth);

    // go through each player in current node, and assign it to the correct child
    console.log("HERE");
    console.log(parent.players);
    for(var i in parent.players){
      var p = parent.players[i];
      if(p.x >= 0 && p.x < y_axis && p.y >= 0 && p.y < x_axis) {
        parent.children.nw.players.push(p);
        console.log("SHOULD DELETE");
      }
      else if(p.x >= 0 && p.x < y_axis && p.y >= x_axis && p.y <= p_bounds.bottom) {
        parent.children.sw.players.push(p);
        console.log("SHOULD DELETE");
      }
      else if(p.x >= y_axis && p.x < p_bounds.right && p.y >= 0 && p.y < y_axis) {
        parent.children.ne.players.push(p);
        console.log("SHOULD DELETE");
      }
      else if(p.x >= y_axis && p.x < p_bounds.right && p.y >= x_axis && p.y <= p_bounds.bottom) {
        parent.children.se.players.push(p);
        console.log("SHOULD DELETE");
      }
      else{
        console.log("Error. Couldn't update children node. ERROR!");
      }
    }
    parent.players = []; // clear children in parent node

    // recursively call it. Absolutely ugly, but meh. tired atm. TODO:
    if(p.x >= 0 && p.x < y_axis && p.y >= 0 && p.y < x_axis) {
      this.insert(player, parent.children.nw);
    }
    else if(p.x >= 0 && p.x < y_axis && p.y >= x_axis && p.y <= p_bounds.bottom) {
      this.insert(player, parent.children.sw);
    }
    else if(p.x >= y_axis && p.x < p_bounds.right && p.y >= 0 && p.y < y_axis) {
      this.insert(player, parent.children.ne);
    }
    else if(p.x >= y_axis && p.x < p_bounds.right && p.y >= x_axis && p.y <= p_bounds.bottom) {
      this.insert(player, parent.children.se);
    }
    else{
      console.log("ERROR. COULDN'T INSER TNODE> ERROR");
    }

    // check the bounds of the player, and then recursively call it on the children
  }


    

    //var player_depth = parent.depth + 1 > parent.maxDepth ? parent.depth : parent.depth;
    //var new_node = new QuadTreeNode(player_bounds, );  

}


QuadTree.prototype.remove = function(userid) {
  console.log(this);

  var remove_helper = function(userid, node){
    console.log('inside')
    console.log(node)
    if(node.children === {})
      return;
    for(var i in node.players) {
      if(node.players[i].userid === userid){
        delete node.players[i];
        return true;
      }
    }
    for(var i in node.children) {
      if(remove_helper(userid,node.children[i])){
        return true;
      }
    }
    return false;
  }
  remove_helper(userid, this.root);

}

/*
// for testing
var q = new QuadTree({left:0, right:400, top: 0, bottom: 600}, 3, 4)
var new_player1 = {
        userid: "userid",
        name: "name",
        vX: 0,
        vY: 0,
        x: 0,
        y: 0 
      };
var new_player2 = { 
        userid: "userid",
        name: "name",
        vX: 0,
        vY: 0,
        x: 50,
        y: 50 
      }   ;
var new_player3 = { 
        userid: "userid",
        name: "name",
        vX: 0,
        vY: 0,
        x: 300,
        y: 300 
      }   ;
var new_player4 = { 
        userid: "userid",
        name: "name",
        vX: 0,
        vY: 0,
        x: 100,
        y: 100 
      }   
q.insert(new_player1);
q.insert(new_player2);
q.insert(new_player3);
q.insert(new_player4);
q.insert(new_player1);
q.insert(new_player1);
q.insert(new_player1);
q.insert(new_player1);
*/
