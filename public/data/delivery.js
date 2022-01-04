const addzoneCodes = [
    31708, 32133, 33411, 54000, 28826, 59106, 59127, 59129, 59650, 59766,
  ]
  const addzoneCodeRanges = [
    [63000, 63644],
    [22386, 22388],
    [23004, 23010],
    [23100, 23116],
    [23124, 23136],
    [40200, 40240],
    [46768, 46771],
    [52570, 52571],
    [53031, 53033],
    [53089, 53104],
    [56347, 56349],
    [57068, 57069],
    [58760, 58762],
    [58800, 58810],
    [58816, 58818],
    [58828, 58866],
    [58953, 58958],
    [59102, 59103],
    [59137, 59166],
    [59781, 59790],
  ]
  
  export const delivery = 3000
  export const delivery_add = 2000
  export const free_base = 50000

  export const isAdd = (zonecode) => {
    if(addzoneCodeRanges.filter((range) => 
    (zonecode >= range[0] && zonecode <= range[1])).length > 0) {
      return true
    }
  
    if (addzoneCodes.includes(zonecode)) {
      return true
    }
  
    return false
  }
  
  export default { delivery, delivery_add, free_base, isAdd }
  