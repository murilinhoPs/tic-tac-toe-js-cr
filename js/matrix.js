var cubes = [
    [1, 1, 0],
    [1, 5, 0],
    [5, 1, 5],
  ]
  
  for (var l = 0; l < cubes.length; l++) {
    var cube = cubes[l]
    for (var c = 0; c < cube.length; c++) {
      console.log('cube[' + l + '][' + c + '] = ' + cube[c])
    }
  }
  
  let somas = []
  somas.push(cube[0][0] + cube[0][1] + cube[0][2])
  somas.push(cube[1][0] + cube[1][1] + cube[1][2])
  somas.push(cube[2][0] + cube[2][1] + cube[2][2])
  somas.push(cube[0][0] + cube[1][0] + cube[2][0])
  somas.push(cube[0][1] + cube[1][1] + cube[2][1])
  somas.push(cube[0][2] + cube[1][2] + cube[2][2])
  somas.push(cube[0][0] + cube[1][1] + cube[2][2])
  somas.push(cube[0][2] + cube[1][1] + cube[2][0])
  for (let i = 0; i < 8; i++) {
    if (somas[i] === 2) {
    } else if (somas[i] === 10) {
    }
  }
  