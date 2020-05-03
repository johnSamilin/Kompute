var Entity = function(id, center, size){
  this.id = id;
  this.size = size;
  this.position = center.clone();

  this.nearbyObject = null;
}

Entity.prototype.setPosition = function(position){
  this.position.copy(position);

  if (this.world){
    this.world.updateEntity(this, this.position, this.size);
  }
}

Entity.prototype.executeForEachCloseEntity = function(func){
  if (!this.world){
    return;
  }
  var res = this.world.getNearbyObjects(this.position);
  for (var obj of res){
    if (obj.id != this.id){
      func(this.world.getEntityByID(obj.id));
    }
  }
}

export { Entity };
