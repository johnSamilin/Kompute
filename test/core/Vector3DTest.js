var expect = require('expect.js');
var Kompute = require("../../build/Kompute");

describe("Vector3D", function(){

  it("should set 0 by default", function(){

    var vect = new Kompute.Vector3D();

    expect(vect.x).to.eql(0);
    expect(vect.y).to.eql(0);
    expect(vect.z).to.eql(0);
  });

  it("should set", function(){

    var vect = new Kompute.Vector3D(10, 20, 30);

    expect(vect.x).to.eql(10);
    expect(vect.y).to.eql(20);
    expect(vect.z).to.eql(30);
  });

  it("should multiply scalar", function(){

    var vect = new Kompute.Vector3D(10, 20, 30);

    vect.multiplyScalar(10);

    expect(vect.x).to.eql(100);
    expect(vect.y).to.eql(200);
    expect(vect.z).to.eql(300);
  });

  it("should copy", function(){

    var vect = new Kompute.Vector3D();
    var vect2 = new Kompute.Vector3D(100, 200, 300);

    vect.copy(vect2);

    expect(vect).to.eql(vect2);
  });

  it("should clone", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.clone()).to.eql(vect);
  });

  it("should min", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);
    var vect2 = new Kompute.Vector3D(-100, 300, 50);

    vect.min(vect2);

    expect(vect.x).to.eql(-100);
    expect(vect.y).to.eql(200);
    expect(vect.z).to.eql(50);
  });

  it("should max", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);
    var vect2 = new Kompute.Vector3D(500, 300, -350);

    vect.max(vect2);

    expect(vect.x).to.eql(500);
    expect(vect.y).to.eql(300);
    expect(vect.z).to.eql(300);
  });

  it("should get length", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.getLength()).to.eql(Math.sqrt(140000));
  });

  it("should add", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.add(new Kompute.Vector3D(500, 600, 700))).to.eql(new Kompute.Vector3D(600, 800, 1000));
  });

  it("should sub", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.sub(new Kompute.Vector3D(500, 700, 10))).to.eql(new Kompute.Vector3D(-400, -500, 290));
  });

  it("should normalize", function(){

    var vect = new Kompute.Vector3D(100, 200, 300);

    expect(vect.normalize().getLength()).to.eql(1);
  });

  it("should perform dot product", function(){

    var v1 = new Kompute.Vector3D(0, 0, 1);
    var v2 = new Kompute.Vector3D(1, 0, 0);

    expect(v1.dot(v2)).to.eql(0);

    v1.set(10, 20, 30);
    v2.set(-10, -20, -30);

    expect(v1.dot(v2)).to.eql(-100-400-900);
  });

  it("should apply quaternion", function(){

    var v1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random()).normalize();
    var v2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random()).normalize();

    var q = new Kompute.Quaternion().setFromVectors(v1, v2);

    v1.applyQuaternion(q);

    var dot = v1.dot(v2);

    expect(Math.abs(dot - 1).toFixed(8)).to.eql(0);
  });

  it("should perform cross product", function(){
    for (var i = 0; i < 1000; i++){
      var v1 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
      var v2 = new Kompute.Vector3D(Math.random(), Math.random(), Math.random());
      var cross1 = new Kompute.Vector3D().copy(v1).cross(v2);
      var cross2 = new Kompute.Vector3D().copy(v2).cross(v1);
      expect(v1.dot(cross1).toFixed(8)).to.eql(0);
      expect(v2.dot(cross1).toFixed(8)).to.eql(0);
      expect(v1.dot(cross2).toFixed(8)).to.eql(0);
      expect(v2.dot(cross2).toFixed(8)).to.eql(0);
    }
  });

  it("should negate", function(){
    var vec = new Kompute.Vector3D(100 * (Math.random() - 0.5), 100 * (Math.random() - 0.5), 100 * (Math.random() - 0.5));
    var negative = vec.clone().negate();

    expect(vec.add(negative)).to.eql(new Kompute.Vector3D());
  });

  it("should check if equal", function(){
    var vec = new Kompute.Vector3D(10, 20, 30);
    var vec2 = new Kompute.Vector3D(30, 40, 50);

    expect(vec.clone().eql(vec)).to.eql(true);
    expect(vec.eql(vec2)).to.eql(false);
  });

  it("should perform toFixed", function(){
    var vec = new Kompute.Vector3D(0.0123456, 0.5671912, 0.45438909834);

    expect(vec.toFixed(3)).to.eql(new Kompute.Vector3D(0.012, 0.567, 0.454));
  });

  it("should get distance square", function(){

    var v1 = new Kompute.Vector3D(100, 200, 300);
    var v2 = new Kompute.Vector3D(300, 400, 500);

    var distanceSq = v1.getDistanceSq(v2);

    var len = v1.sub(v2).getLength();

    expect(distanceSq).to.eql(len * len);
  });
});
