console.log("[CLIENT-LOADED]")
let noClip = false

function getCamDirection(){
  let heading = GetGameplayCamRelativeHeading()+GetEntityHeading(GetPlayerPed(-1))
  let pitch = GetGameplayCamRelativePitch()
  let x = -Math.sin(heading*Math.PI/180.0)
  let y = Math.cos(heading*Math.PI/180.0)
  let z = Math.sin(pitch*Math.PI/180.0)
  let len = Math.sqrt(x*x+y*y+z*z)
  if (len != 0) {
    x = x / len
    y = y / len
    z = z / len
  }
  return [x,y,z]
}

setTick(() => {
    const ped = PlayerPedId()
    if (noClip) {
      let [coordx, coordy, coordz] = GetEntityCoords(ped)
      let [dx,dy,dz] = getCamDirection()
      let speed = 1.0

      SetEntityVelocity(ped,1.0,1.0,1.0)

      if (IsControlJustPressed(1,21)) {
        speed = 25.0
      }

      if (IsControlPressed(1,32)) {
        coordx = coordx+speed*dx
        coordy = coordy+speed*dy
        coordz = coordz+speed*dz
      }

      if (IsControlPressed(1,269)) {
        coordx = coordx+speed*dx
        coordy = coordy+speed*dy
        coordz = coordz+speed*dz
      }

      SetEntityCoordsNoOffset(ped,coordx,coordy,coordz,true,true,true)
    }
});

RegisterCommand("sethealth",function(_,args,rawCommand){
  SetEntityHealth(PlayerPedId(),Number(args[0]))
  console.log(`Vida do ped setada em: `, args[0])
},false);

RegisterCommand("getcoords",function(_,args,rawCommand){
  let [coordsx, coordsy, coordsz] = GetEntityCoords(PlayerPedId())
  console.log(`Suas coordenadas atual são: `, coordsx,coordsy,coordsz);
},false);

RegisterCommand("gethealth",function(_,args,rawCommand){
  const health = GetEntityHealth(PlayerPedId());
  console.log(`Vida atual do ped: `, health)
},false);

RegisterCommand("noclip",function(_,args,rawCommand){
    noClip = !noClip
    const ped = PlayerPedId()
    if (noClip) {
      console.log(`Modo noclip setado em: `, noClip)
      SetEntityInvincible(ped,false)
      SetEntityVisible(ped,false,false)
    } else {
      console.log(`Modo noclip setado em: `, noClip)
      SetEntityInvincible(ped,true)
      SetEntityVisible(ped,true,true)
    };
},false);

RegisterCommand("spawncar",function(_,args,rawCommand){
  let mhash = GetHashKey(args[0])

  setTick(() => {
    if (!HasModelLoaded(mhash)) {
      RequestModel(mhash)
    }
  })

  if (HasModelLoaded(mhash)) {
    let ped = PlayerPedId()
    const vehicleCreate = CreateVehicle(mhash,GetEntityCoords(ped),GetEntityHeading(ped),true,false)
    SetVehicleOnGroundProperly(vehicleCreate)
    SetVehicleNumberPlateText(vehicleCreate,"TKZINDEV")
    SetEntityAsMissionEntity(vehicleCreate,true,true)
    SetPedIntoVehicle(ped,vehicleCreate,-1)
    SetModelAsNoLongerNeeded(vehicleCreate)
  }
},false);


RegisterCommand("deletecar",function(_,args,rawCommand) {
  let vehicle = GetVehiclePedIsUsing(PlayerPedId())
  DeleteEntity(vehicle)
})

