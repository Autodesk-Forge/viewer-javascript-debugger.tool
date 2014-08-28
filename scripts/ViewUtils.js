// Helper functions to zoom into a specific part of the model

function zoomEntirety() {
  zoom(-48722.5, -54872, 44704.8, 10467.3, 1751.8, 1462.8);
}
function zoomEngine() {
  zoom(-17484, -364, 4568, 12927, 173, 1952);
}
function zoomBody() {
  zoom(53143, -7200, 5824, 12870, -327.5, 1674);
}
function zoomInterior() {
  zoom(20459, -19227, 19172.5, 13845, 1228.6, 2906);
}
function zoomWheels() {
  zoom(260.3, 26327, 954, 371.5, 134, 2242.7);
}

// Set the camera based on a position and target location

function zoom(px, py, pz, tx, ty, tz) {

  // Make sure our up vector is correct for this model

  viewer.navigation.setWorldUpVector(new THREE.Vector3(0, 0, 1));

  // This performs a smooth view transition (we might also use
  // setView() to get there more directly)

  viewer.navigation.setRequestTransition(
    true,
    new THREE.Vector3(px, py, pz), new THREE.Vector3(tx, ty, tz),
    viewer.getFOV()
  );
}
