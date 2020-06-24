var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("World", function(){

  it("should initialize", function(){

    var world = new Kompute.World(100, 200, 300, 10);

    expect(world.width).to.eql(100);
    expect(world.height).to.eql(200);
    expect(world.depth).to.eql(300);
    expect(world.entititesByID).to.eql({});
    expect(world.nearby).to.exist;
    expect(world.gravity).to.eql(0);
  });

  it("should insert entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    expect(world.entititesByID).to.eql({entity1: entity});

    var res = world.nearby.query(0, 0, 0);
    expect(res.size).to.eql(1);

    for (var key of res.keys()){
      expect(key).to.eql(entity.nearbyObject);
    }

    expect(entity.lastWorldPosition).to.eql(center);
    expect(entity.lastWorldSize).to.eql(entitySize);
  });

  it("should hide entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    var called = false;
    world.onEntityHidden = function(){
      called = true;
    };

    expect(world.hideEntity(entity)).to.eql(false);
    expect(called).to.eql(false);

    world.insertEntity(entity);

    var res = world.nearby.query(0, 0, 0);
    expect(res.size).to.eql(1);

    expect(world.hideEntity(entity)).to.eql(true);

    expect(called).to.eql(true);

    called = false;

    res = world.nearby.query(0, 0, 0);
    expect(res.size).to.eql(0);

    expect(entity.isHidden).to.eql(true);

    expect(world.hideEntity(entity)).to.eql(false);
    expect(called).to.eql(false);
  });

  it("should show entity", function(){
    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(100, 200, 300, 10);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    var called = false;
    world.onEntityShown = function(){
      called = true;
    };

    expect(world.showEntity(entity)).to.eql(false);
    expect(called).to.eql(false);

    world.insertEntity(entity);

    expect(world.showEntity(entity)).to.eql(false);
    expect(called).to.eql(false);

    world.hideEntity(entity);

    expect(entity.isHidden).to.eql(true);

    var res = world.nearby.query(0, 0, 0);
    expect(res.size).to.eql(0);

    expect(world.showEntity(entity)).to.eql(true);
    expect(called).to.eql(true);

    expect(entity.isHidden).to.eql(false);

    res = world.nearby.query(0, 0, 0);
    expect(res.size).to.eql(1);
  });

  it("should insert graph", function(){

    var graph = new Kompute.Graph();

    graph.addVertex(new Kompute.Vector3D(100, 200, 300));
    graph.addVertex(new Kompute.Vector3D(400, 500, 600));
    graph.addVertex(new Kompute.Vector3D(2000, 2000, 2000));

    var world = new Kompute.World(1000, 1000, 1000, 10);

    world.insertGraph(graph);

    expect(graph.world).to.equal(world);
    expect(graph.vertexIDs.length).to.eql(3);

    expect(graph.vertexIDs[0].startsWith("vertex#")).to.eql(true);
    expect(graph.vertexIDs[1].startsWith("vertex#")).to.eql(true);
    expect(graph.vertexIDs[2].startsWith("vertex#")).to.eql(true);

    world.insertGraph(graph);
    expect(graph.vertexIDs.length).to.eql(3);

    var entities = [];
    world.forEachEntity(function(entity){
      entities.push(entity);
    });

    expect(entities.length).to.eql(3);

    var nearbyObjects = world.getNearbyObjects(new Kompute.Vector3D(100, 200, 300));
    var array = Array.from(nearbyObjects);

    expect(array.length).to.eql(1);

    var vertex = world.getEntityByID(array[0].id);

    expect(vertex.graph).to.equal(graph);
    expect(vertex.position).to.eql(new Kompute.Vector3D(100, 200, 300));
  });

  it("should remove graph", function(){
    var graph = new Kompute.Graph();

    graph.addVertex(new Kompute.Vector3D(100, 200, 300));
    graph.addVertex(new Kompute.Vector3D(400, 500, 600));
    graph.addVertex(new Kompute.Vector3D(2000, 2000, 2000));

    var world = new Kompute.World(1000, 1000, 1000, 10);

    world.insertGraph(graph);
    world.removeGraph(graph);

    expect(graph.vertexIDs.length).to.eql(0);

    var entities = [];
    world.forEachEntity(function(entity){
      entities.push(entity);
    });

    expect(entities.length).to.eql(0);
    var nearbyObjects = world.getNearbyObjects(new Kompute.Vector3D(100, 200, 300));
    var array = Array.from(nearbyObjects);

    expect(array.length).to.eql(0);
  });

  it("should update entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);
    var res1 = world.nearby.query(0, 0, 0);
    expect(res1.size).to.eql(1);

    var called = false;

    world.onEntityUpdated = function(){
      called = true;
    }

    world.updateEntity(entity, new Kompute.Vector3D(100, 100, 100), entitySize);

    expect(called).to.eql(true);

    expect(entity.lastWorldPosition).to.eql(new Kompute.Vector3D(100, 100, 100));
    expect(entity.lastWorldSize).to.eql(entitySize);

    var res2 = world.nearby.query(0, 0, 0);
    expect(res2.size).to.eql(0);

    var res3 = world.nearby.query(90, 90, 90);
    expect(res3.size).to.eql(1);
    for (var key of res3.keys()){
      expect(key).to.eql(entity.nearbyObject);
    }

    called = false;
    world.updateEntity(entity, new Kompute.Vector3D(100, 100, 100), entity.size);
    expect(called).to.eql(false);

    called = false;
    world.updateEntity(entity, new Kompute.Vector3D(), entity.size);
    expect(called).to.eql(true);

    called = false;
    world.updateEntity(entity, new Kompute.Vector3D(), new Kompute.Vector3D(10, 40, 60));
    expect(called).to.eql(true);
  });

  it("should not update entity if entity is hidden", function(){
    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity = new Kompute.Entity("entity1", center, entitySize);

    world.insertEntity(entity);

    var called = false;

    world.onEntityUpdated = function(){
      called = true;
    }

    world.hideEntity(entity);

    world.updateEntity(entity, new Kompute.Vector3D(100, 200, 300), new Kompute.Vector3D(50, 60, 70));
    expect(called).to.eql(false);
    expect(entity.position).to.eql(center);
    expect(entity.size).to.eql(entitySize);
  });

  it("should get entity by ID", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity1 = new Kompute.Entity("entity1", center, entitySize);
    var entity2 = new Kompute.Entity("entity2", center, entitySize);

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    expect(world.getEntityByID("entity1")).to.equal(entity1);
    expect(world.getEntityByID("entity2")).to.equal(entity2);
    expect(world.getEntityByID("entity3")).to.eql(null);
  });

  it("should remove entity", function(){

    var center = new Kompute.Vector3D(10, 10, 10);
    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var world = new Kompute.World(400, 400, 400, 20);
    var entity = new Kompute.Entity("entity", center, entitySize);

    world.insertEntity(entity);
    expect(world.getEntityByID("entity")).not.to.eql(null);
    expect(world.nearby.bin.size).not.to.eql(0);
    world.removeEntity(entity);
    expect(world.getEntityByID("entity")).to.eql(null);
    expect(world.nearby.bin.size).to.eql(0);

    expect(entity.lastWorldPosition).not.to.exist;
    expect(entity.lastWorldSize).not.to.exist;
  });

  it("should get nearby objects", function(){

    var entitySize = new Kompute.Vector3D(5, 5, 5);

    var center1 = new Kompute.Vector3D(10, 10, 10);
    var center2 = new Kompute.Vector3D(-10, -10, -10);
    var center3 = new Kompute.Vector3D(0, 0, 0);
    var center4 = new Kompute.Vector3D(500, 500, 500);

    var world = new Kompute.World(5000, 5000, 5000, 50);

    var entity1 = new Kompute.Entity("entity1", center1, entitySize);
    var entity2 = new Kompute.Entity("entity2", center2, entitySize);
    var entity3 = new Kompute.Entity("entity3", center3, entitySize);
    var entity4 = new Kompute.Entity("entity4", center4, entitySize);

    world.insertEntity(entity1);
    world.insertEntity(entity2);
    world.insertEntity(entity3);
    world.insertEntity(entity4);

    var res = world.getNearbyObjects(new Kompute.Vector3D(0, 0, 0));
    var array = Array.from(res);

    expect(array).to.have.length(3);
    expect(array[0].id).to.eql(entity2.id);
    expect(array[1].id).to.eql(entity3.id);
    expect(array[2].id).to.eql(entity1.id);
  });

  it("should invoke onEntityInserted", function(){

    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityInserted = function(param){
      parameter = param;
    };

    world.insertEntity(entity);

    expect(parameter).to.equal(entity);
  });

  it("should invoke onEntityUpdated", function(){
    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityUpdated = function(param){
      parameter = param;
    };

    world.insertEntity(entity);

    entity.setPosition(new Kompute.Vector3D(100, 200, 300));

    expect(parameter).to.equal(entity);
  });

  it("should invoke onEntityLookDirectionUpdated", function(){
    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityLookDirectionUpdated = function(param){
      parameter = param;
    };

    world.insertEntity(entity);

    entity.setLookDirection(new Kompute.Vector3D(10, 20, 30));

    expect(parameter).to.equal(entity);
  });

  it("should invoke onEntityRemoved", function(){
    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    var parameter = false;
    world.onEntityRemoved = function(param){
      parameter = param;
    };

    world.insertEntity(entity);
    world.removeEntity(entity);

    expect(parameter).to.equal(entity);
  });

  it("should execute for each entity", function(){

    var world = new Kompute.World(5000, 5000, 5000, 50);
    var entity1 = new Kompute.Entity("entity1", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));
    var entity2 = new Kompute.Entity("entity2", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));
    var entity3 = new Kompute.Entity("entity3", new Kompute.Vector3D(), new Kompute.Vector3D(100, 100, 100));

    world.insertEntity(entity1);
    world.insertEntity(entity2);

    var obj = { entity1: false, entity2: false, entity3: false };

    world.forEachEntity(function(entity){
      obj[entity.id] = true;
    });

    expect(obj).to.eql({ entity1: true, entity2: true, entity3: false });
  });

  it("should set gravity", function(){

    var world = new Kompute.World(5000, 5000, 5000, 50);

    world.setGravity(-10);

    expect(world.gravity).to.eql(-10);
  });
});
