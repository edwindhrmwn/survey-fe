var ExcelfitToColumn = function (arrayOfArray, raw) {
  if (!raw) {
    let hasil = []
    arrayOfArray.map((o, i) => {
      let key = Object.keys(o)
      let value = Object.values(o)
      if (i == 0)
        var temp = key.map((q, x) => {
          hasil.push([key[x], value[x]])
          return true;
        })
      else
        var temp = hasil.map((q, x) => {
          hasil[x] = [...hasil[x], Object.values(o)[x]]
          return true;
        })
    })

    return hasil.map(arr => {
      return ({ wch: Math.max(...(arr.map(x => (x ? x.toString().length : 0) + 1))) })
    })
  } else return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i] ? a2[i]?.v != undefined ? a2[i].v.toString().length : a2[i].toString().length + 2 : 0)) }));
}

export { ExcelfitToColumn }